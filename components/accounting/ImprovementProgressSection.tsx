import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { buildImprovementProgressReport } from "../../lib/improvement/buildImprovementProgressReport";
import type { AccountingEntry } from "../../lib/types/accounting";
import type { ImprovementAction } from "../../lib/types/improvementAction";
import type { ImprovementProgressInsight, ImprovementProgressStatus } from "../../lib/types/improvementProgress";

type ImprovementProgressSectionProps = {
  actions: ImprovementAction[];
  entries: AccountingEntry[];
  isLoading: boolean;
  monthLabel: string;
  period: string;
};

const statusLabels: Record<ImprovementProgressStatus, string> = {
  good: "良好",
  notice: "確認",
  warning: "注意"
};

const statusColors: Record<ImprovementProgressStatus, string> = {
  good: "#059669",
  notice: "#2563EB",
  warning: "#EA580C"
};

export function ImprovementProgressSection({
  actions,
  entries,
  isLoading,
  monthLabel,
  period
}: ImprovementProgressSectionProps) {
  const report = useMemo(
    () => buildImprovementProgressReport({ actions, entries, period }),
    [actions, entries, period]
  );
  const completionPercent = Math.round(report.actionSummary.completionRate * 100);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>改善効果トラッキング</Text>
        <Text style={styles.subtitle}>改善アクションの進捗と、今月の会計KPIを一緒に確認します。</Text>
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{isLoading ? "改善効果を読み込み中..." : "改善アクションと会計KPIを反映中"}</Text>
        <Text style={styles.statusMeta}>
          対象月：{monthLabel} / 未完了：{report.actionSummary.todoCount}件 / 完了：
          {report.actionSummary.doneCount}件 / 達成率：{completionPercent}%
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>アクション進捗</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
        </View>
        <View style={styles.metricGrid}>
          <Metric label="合計" value={`${report.actionSummary.totalActionCount}件`} />
          <Metric label="未完了" value={`${report.actionSummary.todoCount}件`} />
          <Metric label="完了" value={`${report.actionSummary.doneCount}件`} />
          <Metric label="保留" value={`${report.actionSummary.deferredCount}件`} />
          <Metric label="達成率" value={`${completionPercent}%`} />
          <Metric label="高優先度 未完了" value={`${report.actionSummary.highPriorityTodoCount}件`} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>会計KPIスナップショット</Text>
        <Text style={styles.cardDescription}>改善アクションの進捗と合わせて、数字の変化を見るための現在値です。</Text>
        <View style={styles.metricGrid}>
          <Metric label="売上" value={formatCurrency(report.kpiSnapshot.revenueTotal)} />
          <Metric label="経費" value={formatCurrency(report.kpiSnapshot.expenseTotal)} />
          <Metric label="利益" value={formatCurrency(report.kpiSnapshot.profit)} />
          <Metric label="家計支出" value={formatCurrency(report.kpiSnapshot.householdTotal)} />
          <Metric label="経費率" value={formatPercent(report.kpiSnapshot.expenseRatio)} />
          <Metric label="利益率" value={formatPercent(report.kpiSnapshot.profitMargin)} />
          <Metric label="投資可能額" value={formatCurrency(report.kpiSnapshot.investableAmount)} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>改善進捗インサイト</Text>
        {report.insights.length > 0 ? (
          <View style={styles.insightList}>
            {report.insights.slice(0, 3).map((insight) => (
              <InsightCard insight={insight} key={insight.id} />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>改善進捗は安定しています。行動と数字を一緒に見ながら、変化を追跡しましょう。</Text>
        )}
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function InsightCard({ insight }: { insight: ImprovementProgressInsight }) {
  const color = statusColors[insight.status];

  return (
    <View style={[styles.insightCard, { borderLeftColor: color }]}>
      <View style={styles.insightHeader}>
        <View style={[styles.badge, { borderColor: color, backgroundColor: `${color}12` }]}>
          <Text style={[styles.badgeText, { color }]}>{statusLabels[insight.status]}</Text>
        </View>
        {insight.metricLabel && insight.metricValue ? (
          <Text style={styles.insightMetric}>
            {insight.metricLabel}：{insight.metricValue}
          </Text>
        ) : null}
      </View>
      <Text style={styles.insightTitle}>{insight.title}</Text>
      <Text style={styles.insightMessage}>{insight.message}</Text>
      <Text style={styles.recommendation}>{insight.recommendation}</Text>
    </View>
  );
}

function formatCurrency(value: number) {
  const absValue = Math.abs(Math.round(value));
  return `${value < 0 ? "-" : ""}¥${absValue.toLocaleString("ja-JP")}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
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
  statusText: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  statusMeta: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 3
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    padding: 14,
    width: "100%"
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0
  },
  cardDescription: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5
  },
  progressTrack: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    height: 12,
    marginTop: 12,
    overflow: "hidden",
    width: "100%"
  },
  progressFill: {
    backgroundColor: "#22C55E",
    borderRadius: 999,
    height: "100%"
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  metricItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexGrow: 1,
    minWidth: 118,
    padding: 9
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800"
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 2
  },
  insightList: {
    gap: 9,
    marginTop: 12
  },
  insightCard: {
    backgroundColor: "#F8FAFC",
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 11,
    width: "100%"
  },
  insightHeader: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900"
  },
  insightMetric: {
    color: "#334155",
    fontSize: 11,
    fontWeight: "900"
  },
  insightTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19,
    marginTop: 8
  },
  insightMessage: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  recommendation: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 7
  },
  emptyText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 10
  }
});
