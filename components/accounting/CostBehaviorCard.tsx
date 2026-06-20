import { StyleSheet, Text, View } from "react-native";

import type { CostBehaviorBreakdown } from "../../lib/types/accountingAnalysis";
import { SegmentBreakdownBar } from "./SegmentBreakdownBar";

type CostBehaviorCardProps = {
  breakdown: CostBehaviorBreakdown;
};

export function CostBehaviorCard({ breakdown }: CostBehaviorCardProps) {
  const total = breakdown.fixed + breakdown.variable;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>固定費・変動費</Text>
      <SegmentBreakdownBar
        emptyMessage="支出データがまだありません"
        items={[
          { label: "固定費", value: breakdown.fixed, color: "#7C3AED" },
          { label: "変動費", value: breakdown.variable, color: "#2563EB" }
        ]}
      />
      {total > 0 ? <Text style={styles.total}>合計 {formatYen(total)}</Text> : null}
      <Text style={styles.memo}>固定費が大きいほど、毎月の自由度が下がります。</Text>
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
