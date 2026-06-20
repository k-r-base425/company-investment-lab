import { StyleSheet, Text, View } from "react-native";

import type { CategoryBreakdownItem } from "../../lib/types/accountingAnalysis";

type BreakdownBarListProps = {
  emptyMessage: string;
  items: CategoryBreakdownItem[];
  maxItems?: number;
  tone: string;
};

export function BreakdownBarList({ emptyMessage, items, maxItems, tone }: BreakdownBarListProps) {
  const visibleItems = typeof maxItems === "number" ? items.slice(0, maxItems) : items;

  if (visibleItems.length === 0) {
    return <Text style={styles.emptyText}>{emptyMessage}</Text>;
  }

  return (
    <View style={styles.list}>
      {visibleItems.map((item) => (
        <View key={item.category} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.amount}>{formatYen(item.amount)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{formatPercent(item.ratio)}</Text>
            <Text style={styles.metaText}>{item.count}件</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { backgroundColor: tone, width: `${clampRatio(item.ratio) * 100}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

function clampRatio(value: number) {
  return Math.min(1, Math.max(0, value));
}

function formatYen(value: number) {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

const styles = StyleSheet.create({
  list: {
    gap: 12
  },
  row: {
    gap: 7
  },
  rowHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0
  },
  category: {
    color: "#0F172A",
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19,
    minWidth: 0
  },
  amount: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900"
  },
  metaRow: {
    flexDirection: "row",
    gap: 10
  },
  metaText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800"
  },
  track: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    height: 9,
    overflow: "hidden",
    width: "100%"
  },
  fill: {
    borderRadius: 999,
    height: "100%"
  },
  emptyText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19
  }
});
