import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { LearningMemoEditor } from "./LearningMemoEditor";
import { LearningMemoFilterChips } from "./LearningMemoFilterChips";
import { LearningMemoSearchResultList } from "./LearningMemoSearchResultList";
import {
  deleteLearningMemo,
  getLearningMemos,
  initLearningMemoStorage,
  updateLearningMemo
} from "../../lib/storage/learningMemoRepository";
import {
  defaultLearningMemoSearchState,
  searchLearningMemos
} from "../../lib/learning/searchLearningMemos";
import type { LearningMemo } from "../../lib/types/learningMemo";
import type {
  LearningMemoCategoryFilter,
  LearningMemoSearchState,
  LearningMemoSortKey,
  LearningMemoSourceFilter
} from "../../lib/types/learningMemoSearch";

export type LearningMemoSearchTopic = {
  id: string;
  title: string;
};

type LearningMemoSearchSectionProps = {
  onMemoChanged?: () => void;
  refreshKey?: number;
  topics: LearningMemoSearchTopic[];
};

const categoryOptions: { label: string; value: LearningMemoCategoryFilter }[] = [
  { label: "すべて", value: "all" },
  { label: "会計", value: "accounting" },
  { label: "簿記", value: "bookkeeping" },
  { label: "投資", value: "investment" },
  { label: "AI", value: "ai_analysis" },
  { label: "経営", value: "business" },
  { label: "その他", value: "other" }
];

const sourceOptions: { label: string; value: LearningMemoSourceFilter }[] = [
  { label: "すべて", value: "all" },
  { label: "手動", value: "manual" },
  { label: "AI分析", value: "ai_analysis" },
  { label: "会計", value: "accounting" },
  { label: "投資", value: "investment" }
];

const sortOptions: { label: string; value: LearningMemoSortKey }[] = [
  { label: "新しい順", value: "newest" },
  { label: "古い順", value: "oldest" },
  { label: "テーマ順", value: "topic" },
  { label: "カテゴリ順", value: "category" }
];

export function LearningMemoSearchSection({ onMemoChanged, refreshKey = 0, topics }: LearningMemoSearchSectionProps) {
  const [memos, setMemos] = useState<LearningMemo[]>([]);
  const [state, setState] = useState<LearningMemoSearchState>(defaultLearningMemoSearchState);
  const [editingMemo, setEditingMemo] = useState<LearningMemo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const searchResult = useMemo(() => searchLearningMemos({ memos, state }), [memos, state]);
  const latestMemos = useMemo(
    () => [...memos].sort((a, b) => getMemoSortDate(b).localeCompare(getMemoSortDate(a))).slice(0, 3),
    [memos]
  );
  const aiDerivedCount = useMemo(
    () => memos.filter((memo) => memo.source === "ai_analysis" || memo.sourceAiAnalysisRunId).length,
    [memos]
  );
  const topicOptions = useMemo(
    () => [{ label: "すべて", value: "all" }, ...topics.map((topic) => ({ label: topic.title, value: topic.id }))],
    [topics]
  );

  useEffect(() => {
    loadMemos();
  }, [refreshKey]);

  const updateState = <K extends keyof LearningMemoSearchState>(key: K, value: LearningMemoSearchState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const loadMemos = async () => {
    try {
      setIsLoading(true);
      setError("");
      await initLearningMemoStorage();
      setMemos(await getLearningMemos());
    } catch {
      setMemos([]);
      setError("学習メモの読み込みに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 2200);
  };

  const handleUpdateMemo = async ({ body, title }: { body: string; title: string }) => {
    if (!editingMemo) {
      return false;
    }

    try {
      setError("");
      await updateLearningMemo({
        ...editingMemo,
        body,
        title,
        updatedAt: new Date().toISOString()
      });
      setEditingMemo(null);
      await loadMemos();
      onMemoChanged?.();
      showFeedback("学習メモを更新しました");
      return true;
    } catch {
      setError("学習メモの更新に失敗しました。");
      return false;
    }
  };

  const handleDeleteMemo = async (memo: LearningMemo) => {
    try {
      setError("");
      await deleteLearningMemo(memo.id);
      if (editingMemo?.id === memo.id) {
        setEditingMemo(null);
      }
      await loadMemos();
      onMemoChanged?.();
      showFeedback("学習メモを削除しました");
    } catch {
      setError("学習メモの削除に失敗しました。");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchCard}>
        <Text style={styles.cardTitle}>検索条件</Text>
        <TextInput
          onChangeText={(value) => updateState("keyword", value)}
          placeholder="メモを検索"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={state.keyword}
        />

        <LearningMemoFilterChips
          label="カテゴリ"
          onChange={(value) => updateState("category", value)}
          options={categoryOptions}
          value={state.category}
        />

        <LearningMemoFilterChips
          label="source"
          onChange={(value) => updateState("source", value)}
          options={sourceOptions}
          value={state.source}
        />

        <LearningMemoFilterChips
          label="テーマ"
          onChange={(value) => updateState("topicId", value)}
          options={topicOptions}
          value={state.topicId}
        />

        <View style={styles.filterGrid}>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateState("onlyAiDerived", !state.onlyAiDerived)}
            style={({ pressed }) => [
              styles.toggleButton,
              state.onlyAiDerived && styles.toggleButtonActive,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={[styles.toggleButtonText, state.onlyAiDerived && styles.toggleButtonTextActive]}>
              AI分析由来のみ
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setState(defaultLearningMemoSearchState)}
            style={({ pressed }) => [styles.resetButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.resetButtonText}>条件をリセット</Text>
          </Pressable>
        </View>

        <LearningMemoFilterChips
          label="並び替え"
          onChange={(value) => updateState("sortKey", value)}
          options={sortOptions}
          value={state.sortKey}
        />
      </View>

      <View style={styles.recentCard}>
        <View style={styles.resultHeader}>
          <View style={styles.resultHeaderText}>
            <Text style={styles.cardTitle}>最近のメモ</Text>
            <Text style={styles.smallText}>学習メモ: {memos.length}件 / AI分析由来: {aiDerivedCount}件</Text>
          </View>
          <Text style={styles.searchHint}>検索で探す</Text>
        </View>
        {latestMemos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>学習メモはまだありません。</Text>
            <Text style={styles.emptyText}>学習カードやAI分析履歴からメモを保存できます。</Text>
          </View>
        ) : (
          <View style={styles.latestList}>
            {latestMemos.map((memo) => (
              <View key={memo.id} style={styles.latestRow}>
                <Text style={styles.latestTitle}>{memo.title}</Text>
                <Text style={styles.latestMeta}>{memo.topicTitle}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.resultHeaderText}>
            <Text style={styles.cardTitle}>検索結果</Text>
            <Text style={styles.smallText}>
              {searchResult.filteredCount}件 / 全{searchResult.totalCount}件
            </Text>
          </View>
        </View>

        {isLoading ? <Text style={styles.statusText}>学習メモを読み込んでいます...</Text> : null}
        {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {editingMemo ? (
          <LearningMemoEditor
            initialMemo={editingMemo}
            onCancel={() => setEditingMemo(null)}
            onSave={handleUpdateMemo}
          />
        ) : null}

        {!isLoading && memos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>学習メモはまだありません。</Text>
            <Text style={styles.emptyText}>学習カードやAI分析履歴からメモを保存できます。</Text>
          </View>
        ) : null}

        {!isLoading && memos.length > 0 && searchResult.results.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>条件に一致する学習メモがありません。</Text>
            <Text style={styles.emptyText}>キーワードやフィルターを変更してください。</Text>
          </View>
        ) : null}

        <LearningMemoSearchResultList
          memos={searchResult.results}
          onDelete={handleDeleteMemo}
          onEdit={setEditingMemo}
        />
      </View>
    </View>
  );
}

function getMemoSortDate(memo: LearningMemo) {
  return memo.updatedAt || memo.createdAt;
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: "100%"
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 14,
    width: "100%"
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%"
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  toggleButton: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  toggleButtonActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#34D399"
  },
  toggleButtonText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  toggleButtonTextActive: {
    color: "#047857"
  },
  resetButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  resetButtonText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  recentCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14,
    width: "100%"
  },
  resultHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    minWidth: 0
  },
  resultHeaderText: {
    flex: 1,
    minWidth: 0
  },
  smallText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 3
  },
  searchHint: {
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    color: "#3730A3",
    flexShrink: 0,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  latestList: {
    gap: 8,
    marginTop: 10
  },
  latestRow: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10
  },
  latestTitle: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  latestMeta: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 2
  },
  emptyBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    padding: 12
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  emptyText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  statusText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  feedbackText: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  buttonPressed: {
    opacity: 0.78
  }
});
