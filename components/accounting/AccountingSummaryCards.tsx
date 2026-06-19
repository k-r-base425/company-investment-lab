import { StyleSheet, Text, View } from "react-native";

import type { MonthlyAccountingSummary } from "../../lib/types/accounting";

type AccountingSummaryCardsProps = {
  summary: MonthlyAccountingSummary;
};

export function AccountingSummaryCards({ summary }: AccountingSummaryCardsProps) {
  const summaryItems = [
    { label: "今月の売上", value: formatYen(summary.revenueTotal), tone: "#2563EB" },
    { label: "今月の経費", value: formatYen(summary.expenseTotal), tone: "#EA580C" },
    { label: "今月の利益", value: formatYen(summary.profit), tone: summary.profit >= 0 ? "#059669" : "#B91C1C" },
    { label: "家計支出", value: formatYen(summary.householdTotal), tone: "#0F766E" }
  ];

  return (
    <View style={styles.grid}>
      {summaryItems.map((item) => (
        <View key={item.label} style={[styles.card, { borderColor: item.tone }]}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={[styles.value, { color: item.tone }]} adjustsFontSizeToFit numberOfLines={1}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function formatYen(value: number) {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    width: "100%"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 82,
    minWidth: 0,
    padding: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1
  },
  label: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0
  },
  value: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 25,
    marginTop: 8,
    minWidth: 0
  }
});
