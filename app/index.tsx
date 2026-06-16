import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AiAnalysisCard } from "../components/home/AiAnalysisCard";
import { sampleAiAnalysisPayload, sampleMonthlyChartDays } from "../lib/ai/sampleAiAnalysisPayload";
import type { AiAnalysisDay } from "../lib/types/ai";

const metricCards = [
  {
    label: "売上",
    value: sampleAiAnalysisPayload.business.revenue,
    accent: "#2563EB",
    subValue: "+12.4%"
  },
  {
    label: "経費",
    value: sampleAiAnalysisPayload.business.expenses,
    accent: "#EA580C",
    subValue: "経費率 53.9%"
  },
  {
    label: "利益",
    value: sampleAiAnalysisPayload.business.profit,
    accent: "#059669",
    subValue: "利益率 46.1%"
  },
  {
    label: "税金目安",
    value: sampleAiAnalysisPayload.business.estimatedTax,
    accent: "#7C3AED",
    subValue: "概算"
  },
  {
    label: "投資可能額",
    value: sampleAiAnalysisPayload.business.investableAmount,
    accent: "#0891B2",
    subValue: "今月"
  },
  {
    label: "総資産",
    value: sampleAiAnalysisPayload.investment.totalAssets,
    accent: "#4338CA",
    subValue: "現金比率 28.6%"
  }
];

const learningProgress = Math.round(sampleAiAnalysisPayload.learning.progressRate * 100);

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Account Invest Lab</Text>
          <Text style={styles.heading}>ダッシュボード</Text>
        </View>
        <Text style={styles.monthLabel}>2026年6月</Text>
      </View>

      <View style={styles.summaryGrid}>
        {metricCards.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <View style={[styles.metricAccent, { backgroundColor: metric.accent }]} />
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>{formatYen(metric.value)}</Text>
            <Text style={[styles.metricSubValue, { color: metric.accent }]}>{metric.subValue}</Text>
          </View>
        ))}
      </View>

      <MonthlyChart days={sampleMonthlyChartDays} />

      <View style={styles.twoColumnSection}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>資産配分</Text>
          {sampleAiAnalysisPayload.investment.assets.map((asset) => (
            <View key={asset.assetType} style={styles.allocationRow}>
              <Text style={styles.allocationName}>{asset.name}</Text>
              <View style={styles.allocationTrack}>
                <View style={[styles.allocationFill, { width: `${asset.ratio * 100}%` }]} />
              </View>
              <Text style={styles.allocationRatio}>{Math.round(asset.ratio * 100)}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>今日の学習</Text>
          <Text style={styles.learningTitle}>PER / PBR / ROE</Text>
          <Text style={styles.learningBody}>投資指標を利益率と資本効率に結びつけて確認します。</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${learningProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>学習進捗 {learningProgress}%</Text>
        </View>
      </View>

      <AiAnalysisCard />

      <View style={styles.shortcutGrid}>
        <Shortcut label="会計入力" />
        <Shortcut label="家計簿" />
        <Shortcut label="投資分析" />
        <Shortcut label="CSV出力" />
      </View>
    </ScrollView>
  );
}

type MonthlyChartProps = {
  days: AiAnalysisDay[];
};

function MonthlyChart({ days }: MonthlyChartProps) {
  const maxValue = Math.max(...days.map((day) => day.value ?? 0));

  return (
    <View style={styles.chartCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.panelTitle}>月グラフ</Text>
        <Text style={styles.sectionHint}>日別売上サンプル</Text>
      </View>

      <View style={styles.chartGrid}>
        {days.map((day) => {
          const height = day.value === null ? 8 : Math.max((day.value / maxValue) * 96, 18);
          return (
            <View key={day.date} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor: getBarColor(day.status),
                    opacity: day.status === "empty" ? 0.55 : 1
                  }
                ]}
              />
              {day.day % 5 === 0 ? <Text style={styles.barLabel}>{day.day}</Text> : <View style={styles.barLabelSpace} />}
            </View>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <Legend color="#2563EB" label="高" />
        <Legend color="#10B981" label="中" />
        <Legend color="#F97316" label="低" />
        <Legend color="#CBD5E1" label="未入力" />
      </View>
    </View>
  );
}

type ShortcutProps = {
  label: string;
};

function Shortcut({ label }: ShortcutProps) {
  return (
    <View style={styles.shortcut}>
      <Text style={styles.shortcutText}>{label}</Text>
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

function getBarColor(status: AiAnalysisDay["status"]) {
  switch (status) {
    case "high":
      return "#2563EB";
    case "middle":
      return "#10B981";
    case "low":
      return "#F97316";
    case "empty":
      return "#CBD5E1";
    default:
      return "#CBD5E1";
  }
}

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F6F8FC",
    flex: 1
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 56
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18
  },
  kicker: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    marginBottom: 4
  },
  heading: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0
  },
  monthLabel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  metricCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 112,
    padding: 12,
    position: "relative",
    width: "48.5%"
  },
  metricAccent: {
    borderRadius: 999,
    height: 5,
    marginBottom: 11,
    width: 32
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    marginBottom: 6
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0
  },
  metricSubValue: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 7
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 14
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14
  },
  sectionHint: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700"
  },
  panelTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0
  },
  chartGrid: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 3,
    height: 126
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  bar: {
    borderRadius: 4,
    minWidth: 5,
    width: "100%"
  },
  barLabel: {
    color: "#94A3B8",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 6
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
  },
  twoColumnSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  panel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "48.5%"
  },
  allocationRow: {
    marginTop: 11
  },
  allocationName: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6
  },
  allocationTrack: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    height: 7,
    overflow: "hidden"
  },
  allocationFill: {
    backgroundColor: "#4F46E5",
    borderRadius: 999,
    height: "100%"
  },
  allocationRatio: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4
  },
  learningTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20,
    marginTop: 12
  },
  learningBody: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6
  },
  progressTrack: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    height: 8,
    marginTop: 14,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: "#10B981",
    borderRadius: 999,
    height: "100%"
  },
  progressText: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8
  },
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  shortcut: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: "center",
    padding: 10,
    width: "48.5%"
  },
  shortcutText: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "800"
  }
});
