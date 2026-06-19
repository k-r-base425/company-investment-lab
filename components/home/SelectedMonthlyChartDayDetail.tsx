import { StyleSheet, Text, View } from "react-native";

import type { MonthlyChartDay, MonthlyChartMetric } from "../../lib/types/monthlyChart";

type SelectedMonthlyChartDayDetailProps = {
  day: MonthlyChartDay;
  metric: MonthlyChartMetric;
};

const metricLabels: Record<MonthlyChartMetric, string> = {
  revenue: "売上",
  expense: "経費",
  profit: "利益",
  household: "家計"
};

export function SelectedMonthlyChartDayDetail({ day, metric }: SelectedMonthlyChartDayDetailProps) {
  return (
    <View style={styles.detailBox}>
      <Text style={styles.detailDate}>{formatDate(day.date)}</Text>

      {day.value === null ? (
        <Text style={styles.emptyText}>未入力日です</Text>
      ) : (
        <>
          <Text style={styles.primaryValue}>
            {metricLabels[metric]}：{formatYen(day.value)}
          </Text>
          <View style={styles.detailGrid}>
            <DetailItem label="売上" value={formatYen(day.revenueTotal)} />
            <DetailItem label="経費" value={formatYen(day.expenseTotal)} />
            <DetailItem label="利益" value={formatYen(day.profit)} />
            <DetailItem label="家計" value={formatYen(day.householdTotal)} />
            <DetailItem label="入力件数" value={`${day.entryCount}件`} />
          </View>
        </>
      )}
    </View>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function formatDate(date: string) {
  return date.replace(/-/g, "/");
}

function formatYen(value: number) {
  const absoluteValue = Math.abs(Math.round(value));
  const prefix = value < 0 ? "-¥" : "¥";
  return `${prefix}${absoluteValue.toLocaleString("ja-JP")}`;
}

const styles = StyleSheet.create({
  detailBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 12,
    width: "100%"
  },
  detailDate: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 6
  },
  emptyText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19
  },
  primaryValue: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  detailItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0,
    paddingHorizontal: 9,
    paddingVertical: 8
  },
  detailLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800"
  },
  detailValue: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 3
  }
});
