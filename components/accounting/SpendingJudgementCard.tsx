import { StyleSheet, Text, View } from "react-native";

import type { JudgementBreakdown } from "../../lib/types/accountingAnalysis";
import { SegmentBreakdownBar } from "./SegmentBreakdownBar";

type SpendingJudgementCardProps = {
  breakdown: JudgementBreakdown;
};

export function SpendingJudgementCard({ breakdown }: SpendingJudgementCardProps) {
  const total = breakdown.necessary + breakdown.waste + breakdown.investment;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>支出判定</Text>
      <SegmentBreakdownBar
        emptyMessage="支出判定データがまだありません"
        items={[
          { label: "必要支出", value: breakdown.necessary, color: "#2563EB" },
          { label: "浪費", value: breakdown.waste, color: "#EA580C" },
          { label: "投資", value: breakdown.investment, color: "#059669" }
        ]}
      />
      {total > 0 ? <Text style={styles.total}>合計 {formatYen(total)}</Text> : null}
      <Text style={styles.memo}>浪費を減らし、学習・事業・資産形成への投資比率を高めるのが目標です。</Text>
    </View>
  );
}

function formatYen(value: number) {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  title: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 12
  },
  total: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 10
  },
  memo: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 12,
    padding: 10
  }
});
