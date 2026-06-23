import { StyleSheet, Text, View } from "react-native";

import type { AssetAllocationItem, AssetAllocationSummary } from "../../lib/types/asset";
import { AssetAllocationBar, assetToneColors } from "./AssetAllocationBar";

type AssetAllocationCardProps = {
  summary: AssetAllocationSummary;
};

export function AssetAllocationCard({ summary }: AssetAllocationCardProps) {
  const memo = buildCashRatioMemo(summary.cashRatio);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>資産配分</Text>
          <Text style={styles.subtitle}>保存済み投資データから計算</Text>
        </View>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryPill label="総資産" value={formatYen(summary.totalAssets)} />
        <SummaryPill label="現金比率" value={formatPercent(summary.cashRatio)} />
        <SummaryPill label="最終更新" value={summary.updatedAt} wide />
      </View>

      <View style={styles.barWrap}>
        <AssetAllocationBar items={summary.items} />
      </View>

      <View style={styles.legendList}>
        {summary.items.map((item) => (
          <LegendRow key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.memoBox}>
        <Text style={styles.memoText}>{memo}</Text>
      </View>
    </View>
  );
}

type SummaryPillProps = {
  label: string;
  value: string;
  wide?: boolean;
};

function SummaryPill({ label, value, wide }: SummaryPillProps) {
  return (
    <View style={[styles.summaryPill, wide && styles.summaryPillWide]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

type LegendRowProps = {
  item: AssetAllocationItem;
};

function LegendRow({ item }: LegendRowProps) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: assetToneColors[item.colorTone] }]} />
      <Text style={styles.assetName}>{item.name}</Text>
      <Text style={styles.assetRatio}>{formatPercent(item.ratio)}</Text>
      <Text style={styles.assetAmount} numberOfLines={1} adjustsFontSizeToFit>
        {formatYen(item.amount)}
      </Text>
    </View>
  );
}

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function buildCashRatioMemo(cashRatio: number) {
  if (cashRatio < 15) {
    return `現金比率は${formatPercent(cashRatio)}です。現金比率が低めです。投資余力だけでなく、生活防衛資金も確認しましょう。`;
  }

  if (cashRatio > 45) {
    return `現金比率は${formatPercent(cashRatio)}です。現金比率が高めです。投資待機資金としての意図があるか確認しましょう。`;
  }

  return `現金比率は${formatPercent(cashRatio)}です。投資余力と安全資金のバランスを確認しましょう。`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
    width: "100%"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  summaryPill: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 62,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  summaryPillWide: {
    flexBasis: "100%",
    width: "100%"
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 5
  },
  summaryValue: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
    minWidth: 0
  },
  barWrap: {
    marginTop: 16
  },
  legendList: {
    gap: 10,
    marginTop: 16
  },
  legendRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minWidth: 0
  },
  legendDot: {
    borderRadius: 999,
    height: 10,
    width: 10
  },
  assetName: {
    color: "#334155",
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    minWidth: 0
  },
  assetRatio: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right",
    width: 48
  },
  assetAmount: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    minWidth: 72,
    textAlign: "right"
  },
  memoBox: {
    backgroundColor: "#F0FDFA",
    borderColor: "#CCFBF1",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 12
  },
  memoText: {
    color: "#0F766E",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 19
  }
});
