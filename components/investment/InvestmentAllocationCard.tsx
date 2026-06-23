import { StyleSheet, Text, View } from "react-native";

import type { InvestmentAllocationItem } from "../../lib/types/investment";
import { formatInvestmentAmount, formatInvestmentPercent } from "./investmentFormatters";

type InvestmentAllocationCardProps = {
  allocation: InvestmentAllocationItem[];
};

const allocationColors: Record<InvestmentAllocationItem["assetType"], string> = {
  cash: "#14B8A6",
  japanese_stock: "#2563EB",
  us_stock: "#7C3AED",
  mutual_fund: "#22C55E",
  etf: "#F97316"
};

export function InvestmentAllocationCard({ allocation }: InvestmentAllocationCardProps) {
  const visibleAllocation = allocation.filter((item) => item.amount > 0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>資産配分カード</Text>
      <Text style={styles.subtitle}>保有銘柄の評価額を資産種別ごとに集計</Text>

      <View style={styles.segmentBar}>
        {visibleAllocation.length > 0 ? (
          visibleAllocation.map((item) => (
            <View
              key={item.assetType}
              style={[
                styles.segment,
                {
                  backgroundColor: allocationColors[item.assetType],
                  flexGrow: Math.max(item.ratio, 0.02)
                }
              ]}
            />
          ))
        ) : (
          <View style={[styles.segment, styles.emptySegment]} />
        )}
      </View>

      <View style={styles.list}>
        {allocation.map((item) => (
          <View key={item.assetType} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: allocationColors[item.assetType] }]} />
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.ratio}>{formatInvestmentPercent(item.ratio)}</Text>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
              {formatInvestmentAmount(item.amount)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 14,
    width: "100%"
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900"
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  segmentBar: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    flexDirection: "row",
    height: 14,
    marginTop: 14,
    overflow: "hidden",
    width: "100%"
  },
  segment: {
    height: "100%"
  },
  emptySegment: {
    backgroundColor: "#CBD5E1",
    flexGrow: 1
  },
  list: {
    gap: 10,
    marginTop: 14
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minWidth: 0
  },
  dot: {
    borderRadius: 999,
    height: 10,
    width: 10
  },
  label: {
    color: "#334155",
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    minWidth: 0
  },
  ratio: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right",
    width: 52
  },
  amount: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    minWidth: 78,
    textAlign: "right"
  }
});
