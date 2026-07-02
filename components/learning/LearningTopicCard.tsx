import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LearningMemoEditor } from "./LearningMemoEditor";
import { LearningMemoList } from "./LearningMemoList";
import {
  deleteLearningMemo,
  getLearningMemosByTopicId,
  initLearningMemoStorage,
  insertLearningMemo,
  updateLearningMemo
} from "../../lib/storage/learningMemoRepository";
import type { LearningMemo, LearningMemoCategory } from "../../lib/types/learningMemo";

type LearningTopicCardProps = {
  id: string;
  title: string;
  category: "会計" | "投資" | "AI" | "簿記";
  description: string;
  relatedScreens: string[];
  learningPoints: string[];
  memoCategory: LearningMemoCategory;
  onMemoChanged?: () => void;
  memoRefreshKey?: number;
  tone?: "blue" | "green" | "purple" | "orange" | "teal";
};

const toneStyles = {
  blue: {
    badge: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
    border: "#BFDBFE"
  },
  green: {
    badge: { backgroundColor: "#DCFCE7", color: "#166534" },
    border: "#BBF7D0"
  },
  orange: {
    badge: { backgroundColor: "#FFEDD5", color: "#C2410C" },
    border: "#FED7AA"
  },
  purple: {
    badge: { backgroundColor: "#F3E8FF", color: "#7E22CE" },
    border: "#D8B4FE"
  },
  teal: {
    badge: { backgroundColor: "#CCFBF1", color: "#0F766E" },
    border: "#99F6E4"
  }
} as const;

export function LearningTopicCard({
  id,
  title,
  category,
  description,
  relatedScreens,
  learningPoints,
  memoCategory,
  onMemoChanged,
  memoRefreshKey = 0,
  tone = "blue"
}: LearningTopicCardProps) {
  const style = toneStyles[tone];
  const [memos, setMemos] = useState<LearningMemo[]>([]);
  const [editingMemo, setEditingMemo] = useState<LearningMemo | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isMemoListOpen, setIsMemoListOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const latestMemo = memos[0];

  useEffect(() => {
    loadMemos();
  }, [id, memoRefreshKey]);

  const loadMemos = async () => {
    try {
      setError("");
      await initLearningMemoStorage();
      setMemos(await getLearningMemosByTopicId(id));
    } catch {
      setError("学習メモの読み込みに失敗しました");
    }
  };

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => {
      setFeedback("");
    }, 2200);
  };

  const handleSaveMemo = async ({ body, title: memoTitle }: { body: string; title: string }) => {
    try {
      setError("");
      await initLearningMemoStorage();
      const now = new Date().toISOString();

      if (editingMemo) {
        await updateLearningMemo({
          ...editingMemo,
          body,
          title: memoTitle,
          updatedAt: now
        });
        showFeedback("学習メモを更新しました");
      } else {
        await insertLearningMemo({
          id: createId(),
          topicId: id,
          topicTitle: title,
          category: memoCategory,
          title: memoTitle,
          body,
          source: "manual",
          relatedScreen: relatedScreens[0],
          createdAt: now,
          updatedAt: now
        });
        showFeedback("学習メモを保存しました");
      }

      setEditingMemo(null);
      setIsEditorOpen(false);
      setIsMemoListOpen(true);
      await loadMemos();
      onMemoChanged?.();
      return true;
    } catch {
      setError("学習メモの保存に失敗しました");
      return false;
    }
  };

  const handleDeleteMemo = async (memo: LearningMemo) => {
    try {
      setError("");
      await deleteLearningMemo(memo.id);
      showFeedback("学習メモを削除しました");
      await loadMemos();
      onMemoChanged?.();
    } catch {
      setError("学習メモの削除に失敗しました");
    }
  };

  return (
    <View style={[styles.card, { borderColor: style.border }]}>
      <View style={styles.header}>
        <Text style={[styles.badge, style.badge]}>{category}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.metaBox}>
        <Text style={styles.metaLabel}>関連画面</Text>
        <Text style={styles.metaText}>{relatedScreens.join(" / ")}</Text>
      </View>

      <View style={styles.pointList}>
        <Text style={styles.pointTitle}>学習ポイント</Text>
        {learningPoints.map((point) => (
          <Text key={point} style={styles.pointText}>
            ・{point}
          </Text>
        ))}
      </View>

      <View style={styles.memoBox}>
        <View style={styles.memoHeader}>
          <View style={styles.memoHeaderText}>
            <Text style={styles.memoTitle}>学習メモ</Text>
            <Text style={styles.memoSummary}>
              {memos.length > 0 ? `${memos.length}件 / 最新: ${latestMemo?.title}` : "メモはまだありません"}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setEditingMemo(null);
              setIsEditorOpen(true);
            }}
            style={({ pressed }) => [styles.memoAddButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.memoAddButtonText}>メモを追加</Text>
          </Pressable>
        </View>

        {latestMemo ? <Text style={styles.latestMemoText}>{latestMemo.body.slice(0, 80)}</Text> : null}
        {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {isEditorOpen ? (
          <LearningMemoEditor
            initialMemo={editingMemo}
            onCancel={() => {
              setEditingMemo(null);
              setIsEditorOpen(false);
            }}
            onSave={handleSaveMemo}
          />
        ) : null}

        <Pressable
          accessibilityRole="button"
          onPress={() => setIsMemoListOpen((current) => !current)}
          style={({ pressed }) => [styles.memoListToggle, pressed && styles.buttonPressed]}
        >
          <Text style={styles.memoListToggleText}>{isMemoListOpen ? "メモ一覧を閉じる" : "メモ一覧を表示"}</Text>
        </Pressable>

        {isMemoListOpen ? (
          <LearningMemoList
            memos={memos}
            onDelete={handleDeleteMemo}
            onEdit={(memo) => {
              setEditingMemo(memo);
              setIsEditorOpen(true);
            }}
          />
        ) : null}
      </View>
    </View>
  );
}

function createId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `learning-memo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minWidth: 0
  },
  badge: {
    borderRadius: 999,
    flexShrink: 0,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  title: {
    color: "#0F172A",
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
    minWidth: 180
  },
  description: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8
  },
  metaBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginTop: 10,
    padding: 9
  },
  metaLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14
  },
  metaText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 2
  },
  pointList: {
    gap: 4,
    marginTop: 10
  },
  pointTitle: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  pointText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18
  },
  memoBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 10
  },
  memoHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    minWidth: 0
  },
  memoHeaderText: {
    flex: 1,
    minWidth: 0
  },
  memoTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  memoSummary: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 2
  },
  memoAddButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  memoAddButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  latestMemoText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8
  },
  feedbackText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 8
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 8
  },
  memoListToggle: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    minHeight: 36,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  memoListToggleText: {
    color: "#1E3A8A",
    fontSize: 12,
    fontWeight: "900"
  },
  buttonPressed: {
    opacity: 0.78
  }
});
