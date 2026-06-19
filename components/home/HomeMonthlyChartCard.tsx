import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { buildMonthlyChartFromAccountingEntries } from "../../lib/home/buildMonthlyChartFromAccountingEntries";
import type { AccountingEntry } from "../../lib/types/accounting";
import type { MonthlyChartDay, MonthlyChartMetric, MonthlyChartStatus } from "../../lib/types/monthlyChart";
import { MonthlyChartMetricTabs } from "./MonthlyChartMetricTabs";
import { SelectedMonthlyChartDayDetail } from "./SelectedMonthlyChartDayDetail";

type HomeMonthlyChartCardProps = {
  entries: AccountingEntry[];
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
  month: string;
  monthLabel: string;
};

const metricLabels: Record<MonthlyChartMetric, string> = {
  revenue: "売上",
  expense: "経費",
  profit: "利益",
  household: "家計"
};

export function HomeMonthlyChartCard({
  entries,
  errorMessage,
  isFallback,
  isLoading,
  month,
  monthLabel
}: HomeMonthlyChartCardProps) {
  const [metric, setMetric] = useState<MonthlyChartMetric>("profit");
  const chartData = useMemo(
    () => buildMonthlyChartFromAccountingEntries({ entries, metric, month }),
    [entries, metric, month]
  );
  const [selectedDate, setSelectedDate] = useState(() => getInitialSelectedDate(chartData.days));
  const selectedDay = chartData.days.find((day) => day.date === selectedDate) ?? chartData.days[0];

  const handleMetricChange = (nextMetric: MonthlyChartMetric) => {
    const nextChartData = buildMonthlyChartFromAccountingEntries({ entries, metric: nextMetric, month });
    setMetric(nextMetric);
    setSelectedDate(getInitialSelectedDate(nextChartData.days));
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>今月の推移</Text>
          <Text style={styles.subtitle}>保存済み会計データから日別に集計</Text>
        </View>
        <View style={styles.metricBadge}>
          <Text style={styles.metricBadgeText}>{metricLabels[metric]}</Text>
        </View>
      </View>

      <View style={[styles.statusBox, errorMessage && styles.statusBoxError]}>
        <Text style={[styles.statusText, errorMessage && styles.statusTextError]}>{getStatusText({ errorMessage, isFallback, isLoading })}</Text>
      </View>

      <MonthlyChartMetricTabs activeMetric={metric} onChange={handleMetricChange} />

      <View style={styles.metaGrid}>
        <MetaItem label="対象月" value={monthLabel} />
        <MetaItem label="指標" value={metricLabels[metric]} />
        <MetaItem label="入力日数" value={`${chartData.filledDayCount}日`} />
        <MetaItem label="合計" value={formatYen(chartData.total)} />
      </View>

      <View style={styles.chartGrid}>
        {chartData.days.map((day) => {
          const selected = day.date === selectedDay.date;
          const height = getBarHeight(day, chartData.maxValue);
          return (
            <Pressable
              accessibilityRole="button"
              key={day.date}
              onPress={() => setSelectedDate(day.date)}
              style={styles.barColumn}
            >
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: getBarColor(day.status, metric),
                    height,
                    opacity: day.status === "empty" ? 0.55 : 1
                  },
                  selected && styles.selectedBar
                ]}
              />
              {shouldShowLabel(day.day) ? (
                <Text style={[styles.barLabel, selected && styles.selectedBarLabel]}>{day.day}</Text>
              ) : (
                <View style={styles.barLabelSpace} />
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <Legend color={getBarColor("high", metric)} label="高" />
        <Legend color={getBarColor("middle", metric)} label="中" />
        <Legend color={getBarColor("low", metric)} label="低" />
        <Legend color={getBarColor("empty", metric)} label="未入力" />
      </View>

      <SelectedMonthlyChartDayDetail day={selectedDay} metric={metric} />
    </View>
  );
}

type MetaItemProps = {
  label: string;
  value: string;
};

function MetaItem({ label, value }: MetaItemProps) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

type LegendProps = {
  color: string;
  label: string;
};

function Legend({ color, label }: LegendProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function getInitialSelectedDate(days: MonthlyChartDay[]) {
  return days.find((day) => day.value !== null)?.date ?? days[0]?.date ?? "";
}

function getStatusText({
  errorMessage,
  isFallback,
  isLoading
}: {
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
}) {
  if (isLoading) {
    return "月グラフデータを読み込み中...";
  }

  if (errorMessage) {
    return "月グラフデータの読み込みに失敗しました。サンプルデータを表示しています。";
  }

  return isFallback ? "サンプルデータ表示中" : "保存済み会計データを反映中";
}

function getBarHeight(day: MonthlyChartDay, maxValue: number) {
  if (day.value === null || maxValue <= 0) {
    return 8;
  }

  return Math.max((Math.abs(day.value) / maxValue) * 96, 18);
}

function getBarColor(status: MonthlyChartStatus, metric: MonthlyChartMetric) {
  if (status === "empty") {
    return "#CBD5E1";
  }

  if (status === "middle") {
    return "#2563EB";
  }

  if (metric === "expense" || metric === "household") {
    return status === "high" ? "#EA580C" : "#10B981";
  }

  return status === "high" ? "#059669" : "#F97316";
}

function shouldShowLabel(day: number) {
  return day === 1 || day % 5 === 0;
}

function formatYen(value: number) {
  const absoluteValue = Math.abs(Math.round(value));
  const prefix = value < 0 ? "-¥" : "¥";
  return `${prefix}${absoluteValue.toLocaleString("ja-JP")}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
    width: "100%"
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    minWidth: 0
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 16,
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
  metricBadge: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  metricBadgeText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "900"
  },
  statusBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  statusBoxError: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FED7AA"
  },
  statusText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18
  },
  statusTextError: {
    color: "#C2410C"
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  metaItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  metaLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800"
  },
  metaValue: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 3
  },
  chartGrid: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 2,
    height: 126,
    marginTop: 16,
    minWidth: 0,
    width: "100%"
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    minWidth: 0
  },
  bar: {
    borderRadius: 4,
    minWidth: 4,
    width: "100%"
  },
  selectedBar: {
    borderColor: "#0F172A",
    borderWidth: 1,
    transform: [{ scaleX: 1.12 }]
  },
  barLabel: {
    color: "#94A3B8",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 6
  },
  selectedBarLabel: {
    color: "#0F172A"
  },
  barLabelSpace: {
    height: 16
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5
  },
  legendDot: {
    borderRadius: 999,
    height: 8,
    width: 8
  },
  legendText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700"
  }
});
