import { Pressable, StyleSheet, Text, View } from "react-native";

import type { LearningMemo } from "../../lib/types/learningMemo";

type LearningMemoSearchResultListProps = {
  memos: LearningMemo[];
  onDelete: (memo: LearningMemo) => void;
  onEdit: (memo: LearningMemo) => void;
};

const categoryLabels: Record<LearningMemo["category"], string> = {
  accounting: "会計",
  ai_analysis: "AI",
  bookkeeping: "簿記",
  business: "経営",
  investment: "投資",
  other: "その他"
};

const sourceLabels: Record<LearningMemo["source"], string> = {
  accounting: "会計",
  ai_analysis: "AI分析",
  investment: "投資",
  manual: "手動"
};

export function LearningMemoSearchResultList({ memos, onDelete, onEdit }: LearningMemoSearchResultListProps) {
  if (memos.length === 0) {
    return null;
  }

  return (
    <View style={styles.list}>
      {memos.map((memo) => (
        <View key={memo.id} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>{memo.title}</Text>
              <Text style={styles.topic}>{memo.topicTitle}</Text>
            </View>
            <View style={styles.badgeColumn}>
              <Text style={styles.categoryBadge}>{categoryLabels[memo.category]}</Text>
              <Text style={styles.sourceBadge}>{sourceLabels[memo.source]}</Text>
            </View>
          </View>

          <Text style={styles.body}>{memo.body.slice(0, 140)}</Text>

          <View style={styles.metaBox}>
            <Text style={styles.metaText}>作成: {formatDateTime(memo.createdAt)}</Text>
            {memo.sourceAiAnalysisRunTitle ? (
              <Text style={styles.metaText}>AI分析: {memo.sourceAiAnalysisRunTitle}</Text>
            ) : null}
            {memo.relatedScreen ? <Text style={styles.metaText}>関連: {memo.relatedScreen}</Text> : null}
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => onEdit(memo)}
              style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.editButtonText}>編集</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onDelete(memo)}
              style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.deleteButtonText}>削除</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(
    2,
    "0"
  )}:${String(date.getMinutes()).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    width: "100%"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    minWidth: 0
  },
  titleBox: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20
  },
  topic: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 2
  },
  badgeColumn: {
    alignItems: "flex-end",
    flexShrink: 0,
    gap: 5
  },
  categoryBadge: {
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
    color: "#1D4ED8",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  sourceBadge: {
    backgroundColor: "#F3E8FF",
    borderRadius: 999,
    color: "#7E22CE",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  body: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8
  },
  metaBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    gap: 2,
    marginTop: 9,
    padding: 9
  },
  metaText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  editButton: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  editButtonText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "900"
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  deleteButtonText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "900"
  },
  buttonPressed: {
    opacity: 0.78
  }
});
