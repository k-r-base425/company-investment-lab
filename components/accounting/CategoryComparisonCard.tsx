import { StyleSheet, Text, View } from "react-native";

import type { CategoryMonthlyComparisonItem } from "../../lib/types/categoryMonthlyComparison";

type CategoryComparisonCardProps = {
  emptyMessage: string;
  items: CategoryMonthlyComparisonItem[];
  maxItems?: number;
  memo?: string;
  title: string;
  tone: string;
};

const toneColors: Record<CategoryMonthlyComparisonItem["tone"], string> = {
  positive: "#047857",
  negative: "#B91C1C",
  neutral: "#64748B",
  warning: "#C2410C"
};

export function CategoryComparisonCard({
  emptyMessage,
  items,
  maxItems = 5,
  memo,
  title,
  tone
}: CategoryComparisonCardProps) {
  const visibleItems = items.slice(0, maxItems);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.dot, { backgroundColor: tone }]} />
      </View>

      {visibleItems.length > 0 ? (
        <View style={styles.rowList}>
          {visibleItems.map((item) => (
            <CategoryComparisonRow item={item} key={`${item.group}-${item.category}-${item.trend}`} />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      )}

      {memo ? <Text style={styles.memo}>{memo}</Text> : null}
    </View>
  );
}

function CategoryComparisonRow({ item }: { item: CategoryMonthlyComparisonItem }) {
  const color = toneColors[item.tone];

  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <View style={styles.categoryLine}>
          <Text style={styles.category} numberOfLines={2}>{item.category}</Text>
          <View style={[styles.trendBadge, { borderColor: color }]}>
            <Text style={[styles.trendBadgeText, { color }]}>{getTrendLabel(item.trend)}</Text>
          </View>
        </View>
        <Text style={styles.countText}>
          今月 {item.currentCount}件 / 前月 {item.previousCount}件
        </Text>
      </View>
      <View style={styles.amountBox}>
        <Text style={styles.currentAmount}>{item.displayCurrentAmount}</Text>
        <Text style={[styles.difference, { color }]}>{item.displayDifference}</Text>
        <Text style={[styles.percent, { color }]}>{item.displayPercentageChange}</Text>
      </View>
    </View>
  );
}

function getTrendLabel(trend: CategoryMonthlyComparisonItem["trend"]) {
  switch (trend) {
    case "increased":
      return "増加";
    case "decreased":
      return "減少";
    case "new":
      return "新規";
    case "disappeared":
      return "今月なし";
    case "flat":
      return "横ばい";
    case "no_previous":
      return "前月なし";
    default:
      return "";
  }
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
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 12,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    minWidth: 0
  },
  dot: {
    borderRadius: 999,
    height: 10,
    width: 10
  },
  rowList: {
    gap: 8
  },
  row: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  rowMain: {
    flex: 1,
    minWidth: 0
  },
  categoryLine: {
    alignItems: "flex-start",
    gap: 6,
    minWidth: 0
  },
  category: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    minWidth: 0
  },
  trendBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3
  },
  trendBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14
  },
  countText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 5
  },
  amountBox: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 92
  },
  currentAmount: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  difference: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  percent: {
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16
  },
  emptyText: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    padding: 10
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
