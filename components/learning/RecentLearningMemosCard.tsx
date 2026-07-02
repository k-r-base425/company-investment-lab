import { StyleSheet, Text, View } from "react-native";

import type { LearningMemoSummary } from "../../lib/types/learningMemo";

type RecentLearningMemosCardProps = {
  summary: LearningMemoSummary;
};

const categoryLabels: Record<string, string> = {
  accounting: "会計",
  ai_analysis: "AI",
  bookkeeping: "簿記",
  business: "事業",
  investment: "投資",
  other: "その他"
};

export function RecentLearningMemosCard({ summary }: RecentLearningMemosCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>最近の学習メモ</Text>
          <Text style={styles.subtitle}>学習カードやAI分析履歴から保存したメモ。検索であとから探せます。</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{summary.totalCount}件</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaPill}>手動 {summary.manualMemoCount}件</Text>
        <Text style={styles.metaPill}>AI分析由来 {summary.aiDerivedMemoCount}件</Text>
      </View>

      {summary.latestMemos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>学習メモはまだありません。</Text>
          <Text style={styles.emptyText}>学習カードやAI分析履歴からメモを保存できます。</Text>
        </View>
      ) : (
        <View style={styles.memoList}>
          {summary.latestMemos.map((memo) => (
            <View key={memo.id} style={styles.memoRow}>
              <Text style={styles.categoryBadge}>{categoryLabels[memo.category] ?? "その他"}</Text>
              <View style={styles.memoTextBox}>
                <Text style={styles.memoTitle}>{memo.title}</Text>
                <Text style={styles.memoDate}>{formatDate(memo.createdAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 19
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 3
  },
  countBadge: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4
  },
  countText: {
    color: "#166534",
    fontSize: 11,
    fontWeight: "900"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10
  },
  metaPill: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 999,
    borderWidth: 1,
    color: "#475569",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  emptyBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginTop: 10,
    padding: 10
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900"
  },
  emptyText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 3
  },
  memoList: {
    gap: 8,
    marginTop: 10
  },
  memoRow: {
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    padding: 10
  },
  categoryBadge: {
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
  memoTextBox: {
    flex: 1,
    minWidth: 0
  },
  memoTitle: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  memoDate: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 14,
    marginTop: 2
  }
});
