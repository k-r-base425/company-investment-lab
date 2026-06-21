import { StyleSheet, Text, View } from "react-native";

import {
  buildImprovementActionsSummary,
  getTopTodoImprovementActions
} from "../../lib/accounting/buildImprovementActionsSummary";
import type { ImprovementAction, ImprovementActionPriority } from "../../lib/types/improvementAction";

type HomeImprovementActionsCardProps = {
  actions: ImprovementAction[];
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
  errorMessage,
  isLoading,
  monthLabel,
  period
}: HomeImprovementActionsCardProps) {
  const summary = buildImprovementActionsSummary(actions, period);
  const topTodoActions = getTopTodoImprovementActions(actions, period, 3);
  const completionPercent = Math.round(summary.completionRate * 100);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>{monthLabel}</Text>
          <Text style={styles.title}>今月の改善アクション</Text>
        </View>
        <View style={styles.rateBadge}>
          <Text style={styles.rateLabel}>達成率</Text>
          <Text style={styles.rateValue}>{completionPercent}%</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <SummaryPill label="未完了" value={`${summary.todoCount}件`} tone="todo" />
        <SummaryPill label="完了" value={`${summary.doneCount}件`} tone="done" />
        <SummaryPill label="合計" value={`${summary.totalCount}件`} tone="total" />
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
  }
});
