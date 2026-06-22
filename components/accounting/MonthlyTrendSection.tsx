import { StyleSheet, Text, View } from "react-native";

import type {
  MonthlyTrendDirection,
  MonthlyTrendMetricKey,
  MonthlyTrendMetricSummary,
  MonthlyTrendPoint,
  MonthlyTrendReport
} from "../../lib/types/monthlyTrendReport";

type MonthlyTrendSectionProps = {
  errorMessage?: string;
  report: MonthlyTrendReport;
};

const visibleMetricKeys: MonthlyTrendMetricKey[] = [
  "revenue",
  "expense",
  "profit",
  "household",
  "investableAmount"
];

const trendLabels: Record<MonthlyTrendDirection, string> = {
  up: "上向き",
  down: "下向き",
  flat: "横ばい",
  mixed: "変動あり",
  insufficient_data: "データ不足"
};

export function MonthlyTrendSection({ errorMessage, report }: MonthlyTrendSectionProps) {
  const visibleMetrics = visibleMetricKeys
    .map((key) => report.metricSummaries.find((metric) => metric.key === key))
    .filter((metric): metric is MonthlyTrendMetricSummary => Boolean(metric));

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>月比較</Text>
        <Text style={styles.subtitle}>選択月を含む過去6か月の会計サマリーを比較します。</Text>
      </View>

      <View style={[styles.statusBox, errorMessage && styles.statusBoxError]}>
        <Text style={[styles.statusText, errorMessage && styles.statusTextError]}>
          {errorMessage || `対象範囲：${report.points[0]?.monthLabel ?? ""}〜${report.selectedMonthLabel}`}
        </Text>
        <Text style={styles.statusMeta}>
          データあり：{report.dataMonthCount}か月 / 入力なし：{report.emptyMonthCount}か月
        </Text>
      </View>

      {report.dataMonthCount === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>比較できる月次データがまだありません。</Text>
          <Text style={styles.emptySubtext}>会計入力を追加すると、月別の推移を確認できます。</Text>
        </View>
      ) : (
        <View style={styles.cardList}>
          <MonthlySummaryCard points={report.points} />
          <MetricTrendCard metrics={visibleMetrics} />
          <MonthlyTableCard points={report.points} />
        </View>
      )}
    </View>
  );
}

function MonthlySummaryCard({ points }: { points: MonthlyTrendPoint[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>月別サマリー</Text>
      <View style={styles.monthList}>
        {points.map((point) => (
          <View key={point.month} style={[styles.monthSummaryItem, !point.hasData && styles.emptyMonthItem]}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthLabel}>{point.monthLabel}</Text>
              <Text style={[styles.entryBadge, !point.hasData && styles.emptyEntryBadge]}>
                {point.hasData ? `${point.entryCount}件` : "入力なし"}
              </Text>
            </View>
            <View style={styles.summaryGrid}>
              <SummaryCell label="売上" value={formatYen(point.revenueTotal)} />
              <SummaryCell label="経費" value={formatYen(point.expenseTotal)} />
              <SummaryCell label="利益" value={formatYen(point.profit)} tone={point.profit >= 0 ? "#047857" : "#B91C1C"} />
              <SummaryCell label="家計" value={formatYen(point.householdTotal)} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function MetricTrendCard({ metrics }: { metrics: MonthlyTrendMetricSummary[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>主要KPIトレンド</Text>
      <View style={styles.metricList}>
        {metrics.map((metric) => {
          const color = getMetricTrendColor(metric);
          return (
            <View key={metric.key} style={styles.metricItem}>
              <View style={styles.metricMain}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>現在：{metric.currentDisplayValue}</Text>
                <Text style={styles.metricAverage}>平均：{metric.averageDisplayValue}</Text>
              </View>
              <View style={[styles.directionBadge, { borderColor: color }]}>
                <Text style={[styles.directionText, { color }]}>{getMetricDirectionLabel(metric)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function MonthlyTableCard({ points }: { points: MonthlyTrendPoint[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>月別テーブル</Text>
      <View style={styles.tableList}>
        {points.map((point) => (
          <View key={point.month} style={[styles.tableItem, !point.hasData && styles.emptyMonthItem]}>
            <View style={styles.tableHeader}>
              <Text style={styles.monthLabel}>{point.monthLabel}</Text>
              <Text style={styles.tableEntryCount}>{point.entryCount}件</Text>
            </View>
            <View style={styles.tableGrid}>
              <SummaryCell label="売上" value={formatYen(point.revenueTotal)} />
              <SummaryCell label="経費" value={formatYen(point.expenseTotal)} />
              <SummaryCell label="利益" value={formatYen(point.profit)} tone={point.profit >= 0 ? "#047857" : "#B91C1C"} />
              <SummaryCell label="家計" value={formatYen(point.householdTotal)} />
              <SummaryCell label="投資可能額" value={formatYen(point.investableAmount)} tone={point.investableAmount >= 0 ? "#047857" : "#C2410C"} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function SummaryCell({ label, tone, value }: { label: string; tone?: string; value: string }) {
  return (
    <View style={styles.summaryCell}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, tone ? { color: tone } : null]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

function getMetricDirectionLabel(metric: MonthlyTrendMetricSummary) {
  if (metric.direction === "up" && (metric.key === "expense" || metric.key === "household")) {
    return "増加注意";
  }

  if (metric.direction === "down" && (metric.key === "expense" || metric.key === "household")) {
    return "改善傾向";
  }

  return trendLabels[metric.direction];
}

function getMetricTrendColor(metric: MonthlyTrendMetricSummary) {
  if (metric.direction === "insufficient_data" || metric.direction === "flat" || metric.key === "estimatedTax") {
    return "#64748B";
  }

  if (metric.key === "expense" || metric.key === "household") {
    return metric.direction === "up" ? "#C2410C" : "#047857";
  }

  return metric.direction === "up" ? "#047857" : "#C2410C";
}

function formatYen(value: number) {
  const rounded = Math.round(value);
  const absolute = Math.abs(rounded).toLocaleString("ja-JP");
  return rounded < 0 ? `-¥${absolute}` : `¥${absolute}`;
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    width: "100%"
  },
  header: {
    marginBottom: 10
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 5
  },
  statusBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  statusBoxError: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FED7AA"
  },
  statusText: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  statusTextError: {
    color: "#C2410C"
  },
  statusMeta: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 3
  },
  cardList: {
    gap: 10
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 10
  },
  monthList: {
    gap: 8
  },
  monthSummaryItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10
  },
  emptyMonthItem: {
    opacity: 0.58
  },
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8
  },
  monthLabel: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900"
  },
  entryBadge: {
    backgroundColor: "#DBEAFE",
    borderRadius: 8,
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  emptyEntryBadge: {
    backgroundColor: "#E2E8F0",
    color: "#64748B"
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  summaryCell: {
    flexBasis: "47%",
    flexGrow: 1,
    minWidth: 0
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 14
  },
  summaryValue: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
    minWidth: 0
  },
  metricList: {
    gap: 8
  },
  metricItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0,
    padding: 10
  },
  metricMain: {
    flex: 1,
    minWidth: 0
  },
  metricLabel: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  metricValue: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
    marginTop: 3
  },
  metricAverage: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16
  },
  directionBadge: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  directionText: {
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15
  },
  tableList: {
    gap: 8
  },
  tableItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10
  },
  tableHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8
  },
  tableEntryCount: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "900"
  },
  tableGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
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
    marginTop: 5
  }
});
