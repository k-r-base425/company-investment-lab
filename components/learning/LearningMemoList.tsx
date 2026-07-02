import { Pressable, StyleSheet, Text, View } from "react-native";

import type { LearningMemo } from "../../lib/types/learningMemo";

type LearningMemoListProps = {
  memos: LearningMemo[];
  onDelete: (memo: LearningMemo) => void;
  onEdit: (memo: LearningMemo) => void;
};

const sourceLabels: Record<LearningMemo["source"], string> = {
  accounting: "会計",
  ai_analysis: "AI分析",
  investment: "投資",
  manual: "手動メモ"
};

export function LearningMemoList({ memos, onDelete, onEdit }: LearningMemoListProps) {
  if (memos.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>このテーマのメモはまだありません</Text>
        <Text style={styles.emptyText}>学んだことや、次に確認する数字を短く残せます。</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {memos.map((memo) => (
        <View key={memo.id} style={styles.memoCard}>
          <View style={styles.memoHeader}>
            <View style={styles.memoHeaderText}>
              <Text style={styles.memoTitle}>{memo.title}</Text>
              <Text style={styles.memoDate}>{formatDateTime(memo.createdAt)}</Text>
            </View>
            <Text style={styles.sourceBadge}>{sourceLabels[memo.source]}</Text>
          </View>

          <Text style={styles.memoBody}>{memo.body}</Text>

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
    marginTop: 10
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
    fontWeight: "900"
  },
  emptyText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  memoCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 10
  },
  memoHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
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
  memoDate: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 14,
    marginTop: 2
  },
  sourceBadge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    color: "#3730A3",
    flexShrink: 0,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  memoBody: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8
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
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 7
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
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 7
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
