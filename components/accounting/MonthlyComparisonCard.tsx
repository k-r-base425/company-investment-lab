import { StyleSheet, Text, View } from "react-native";

import type { MonthlyComparisonMetric, MonthlyComparisonMetricKey, MonthlyComparisonSummary } from "../../lib/types/monthlyComparison";

type MonthlyComparisonCardProps = {
  comparison: MonthlyComparisonSummary;
  currentMonthLabel: string;
  previousMonthLabel: string;
};

const visibleMetricKeys: MonthlyComparisonMetricKey[] = [
  "revenue",
  "expense",
  "profit",
  "household",
  "investableAmount"
];

const toneColors: Record<MonthlyComparisonMetric["tone"], string> = {
  positive: "#047857",
  negative: "#B91C1C",
  neutral: "#64748B",
  warning: "#C2410C"
};

export function MonthlyComparisonCard({
  comparison,
  currentMonthLabel,
  previousMonthLabel
}: MonthlyComparisonCardProps) {
  const metrics = visibleMetricKeys
    .map((key) => comparison.metrics.find((metric) => metric.key === key))
    .filter((metric): metric is MonthlyComparisonMetric => Boolean(metric));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>前月比</Text>
          <Text style={styles.subtitle}>選択月と前月の会計サマリーを比較</Text>
        </View>
        <Text style={styles.monthBadge}>{currentMonthLabel}</Text>
      </View>

      <Text style={styles.meta}>
        前月：{previousMonthLabel} / {comparison.hasPreviousData ? `${comparison.previousEntryCount}件` : "前月データなし"}
      </Text>

      {comparison.hasPreviousData ? (
        <View style={styles.rowList}>
          {metrics.map((metric) => (
            <ComparisonRow key={metric.key} metric={metric} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>前月データがまだありません。</Text>
          <Text style={styles.emptySubtext}>前月の入力があると比較できます。</Text>
        </View>
      )}
    </View>
  );
}

function ComparisonRow({ metric }: { metric: MonthlyComparisonMetric }) {
  const color = toneColors[metric.tone];

  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <Text style={styles.label}>{metric.label}</Text>
        <Text style={styles.value}>{metric.displayValue}</Text>
      </View>
      <View style={styles.rowTrend}>
        <Text style={[styles.trendValue, { color }]}>{metric.displayDifference}</Text>
        <Text style={[styles.trendPercent, { color }]}>{metric.displayPercentageChange}</Text>
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
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  monthBadge: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  meta: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 8
  },
  rowList: {
    gap: 8,
    marginTop: 12
  },
  row: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  rowMain: {
    flex: 1,
    minWidth: 0
  },
  label: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16
  },
  value: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 19,
    marginTop: 2
  },
  rowTrend: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 84
  },
  trendValue: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  trendPercent: {
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16
  },
  emptyBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 12
  },
  emptyText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19
  },
  emptySubtext: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  }
});
