import type { AccountingInsight, AccountingInsightSeverity } from "../types/accountingInsight";
import type { ImprovementAction, ImprovementActionPriority } from "../types/improvementAction";

type BuildImprovementActionsFromInsightsParams = {
  insights: AccountingInsight[];
  period: string;
};

export function buildImprovementActionsFromInsights({
  insights,
  period
}: BuildImprovementActionsFromInsightsParams): ImprovementAction[] {
  const now = new Date().toISOString();

  return insights.flatMap((insight) =>
    insight.actionItems.map((actionItem, actionIndex) => {
      const actionKey = `${period}:${insight.id}:${actionIndex}:${actionItem}`;

      return {
        id: createId(),
        period,
        title: actionItem,
        description: `${insight.title}：${insight.message}`,
        category: insight.category,
        source: "accounting_insight",
        status: "todo",
        priority: mapSeverityToPriority(insight.severity),
        sourceInsightId: insight.id,
        sourceInsightTitle: insight.title,
        sourceActionIndex: actionIndex,
        actionKey,
        createdAt: now,
        updatedAt: now
      };
    })
  );
}

function mapSeverityToPriority(severity: AccountingInsightSeverity): ImprovementActionPriority {
  if (severity === "danger" || severity === "warning") {
    return "high";
  }

  if (severity === "notice") {
    return "medium";
  }

  return "low";
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
