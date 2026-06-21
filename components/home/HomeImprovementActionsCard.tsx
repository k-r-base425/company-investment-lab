import { StyleSheet, Text, View } from "react-native";

import { buildImprovementProgressReport } from "../../lib/improvement/buildImprovementProgressReport";
import type { AccountingEntry } from "../../lib/types/accounting";
import type { ImprovementAction, ImprovementActionPriority } from "../../lib/types/improvementAction";

type HomeImprovementActionsCardProps = {
  actions: ImprovementAction[];
  entries: AccountingEntry[];
  errorMessage?: string;
  isLoading: boolean;
  monthLabel: string;
  period: string;
};

const priorityLabels: Record<ImprovementActionPriority, string> = {
  high: "高",
  medium: "中",
  low: "低"
};

export function HomeImprovementActionsCard({
  actions,
  entries,
  errorMessage,
  isLoading,
  monthLabel,
  period
}: HomeImprovementActionsCardProps) {
  const report = buildImprovementProgressReport({ actions, entries, period });
  const topTodoActions = [...actions]
    .filter((action) => action.period === period && action.status === "todo")
    .sort((first, second) => getPriorityRank(first.priority) - getPriorityRank(second.priority))
    .slice(0, 3);
  const completionPercent = Math.round(report.actionSummary.completionRate * 100);
  const topInsight = report.insights[0];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>{monthLabel}</Text>
          <Text style={styles.title}>改善進捗</Text>
          <Text style={styles.subtitle}>改善アクションと会計KPIを一緒に確認</Text>
        </View>
        <View style={styles.rateBadge}>
          <Text style={styles.rateLabel}>達成率</Text>
          <Text style={styles.rateValue}>{completionPercent}%</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <SummaryPill label="未完了" value={`${report.actionSummary.todoCount}件`} tone="todo" />
        <SummaryPill label="完了" value={`${report.actionSummary.doneCount}件`} tone="done" />
        <SummaryPill label="高優先度 未完了" value={`${report.actionSummary.highPriorityTodoCount}件`} tone="total" />
        <SummaryPill label="投資可能額" value={formatCurrency(report.kpiSnapshot.investableAmount)} tone="total" />
        <SummaryPill label="経費率" value={formatPercent(report.kpiSnapshot.expenseRatio)} tone="total" />
      </View>

      {isLoading ? <Text style={styles.statusText}>改善アクションを読み込み中...</Text> : null}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {topTodoActions.length > 0 ? (
        <View style={styles.actionList}>
          {topTodoActions.map((action) => (
            <View key={action.id} style={styles.actionRow}>
              <View style={[styles.priorityDot, getPriorityDotStyle(action.priority)]} />
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionMeta}>優先度 {priorityLabels[action.priority]} / 会計タブで管理</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>改善アクションはまだありません。</Text>
          <Text style={styles.emptySubtext}>会計タブの改善コメントから作成できます。</Text>
        </View>
      )}

      {topInsight ? (
        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>{topInsight.title}</Text>
          <Text style={styles.insightText}>{topInsight.recommendation}</Text>
        </View>
      ) : null}
    </View>
  );
}

function SummaryPill({ label, value, tone }: { label: string; value: string; tone: "todo" | "done" | "total" }) {
  return (
    <View style={[styles.summaryPill, tone === "todo" && styles.todoPill, tone === "done" && styles.donePill]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function getPriorityDotStyle(priority: ImprovementActionPriority) {
  if (priority === "high") {
    return styles.highDot;
  }

  if (priority === "medium") {
    return styles.mediumDot;
  }

  return styles.lowDot;
}

function getPriorityRank(priority: ImprovementActionPriority) {
  if (priority === "high") {
    return 0;
  }

  if (priority === "medium") {
    return 1;
  }

  return 2;
}

function formatCurrency(value: number) {
  const absValue = Math.abs(Math.round(value));
  return `${value < 0 ? "-" : ""}¥${absValue.toLocaleString("ja-JP")}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
    width: "100%"
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    minWidth: 0
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  eyebrow: {
    color: "#6366F1",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 4
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
    fontWeight: "800",
    lineHeight: 17,
    marginTop: 4
  },
  rateBadge: {
    alignItems: "flex-end",
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  rateLabel: {
    color: "#6366F1",
    fontSize: 10,
    fontWeight: "900"
  },
  rateValue: {
    color: "#312E81",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 1
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  summaryPill: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexGrow: 1,
    minWidth: 118,
    padding: 10
  },
  todoPill: {
    backgroundColor: "#FFF7ED"
  },
  donePill: {
    backgroundColor: "#ECFDF5"
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "900"
  },
  summaryValue: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2
  },
  statusText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 12
  },
  errorText: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 12
  },
  actionList: {
    gap: 10,
    marginTop: 14
  },
  actionRow: {
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexDirection: "row",
    gap: 9,
    minWidth: 0,
    padding: 10
  },
  priorityDot: {
    borderRadius: 999,
    height: 9,
    marginTop: 5,
    width: 9
  },
  highDot: {
    backgroundColor: "#EA580C"
  },
  mediumDot: {
    backgroundColor: "#4F46E5"
  },
  lowDot: {
    backgroundColor: "#059669"
  },
  actionTextBox: {
    flex: 1,
    minWidth: 0
  },
  actionTitle: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  actionMeta: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 2
  },
  emptyBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginTop: 14,
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
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 4
  },
  insightBox: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 12
  },
  insightTitle: {
    color: "#1E3A8A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19
  },
  insightText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 5
  }
});
