import { calculateMonthlyAccountingSummary } from "../accounting/calculateAccountingSummary";
import type { AccountingEntry } from "../types/accounting";
import type { ImprovementAction } from "../types/improvementAction";
import type { ImprovementProgressInsight, ImprovementProgressReport } from "../types/improvementProgress";

type BuildImprovementProgressReportParams = {
  actions: ImprovementAction[];
  entries: AccountingEntry[];
  period: string;
};

export function buildImprovementProgressReport({
  actions,
  entries,
  period
}: BuildImprovementProgressReportParams): ImprovementProgressReport {
  const periodActions = actions.filter((action) => action.period === period);
  const totalActionCount = periodActions.length;
  const todoCount = periodActions.filter((action) => action.status === "todo").length;
  const doneCount = periodActions.filter((action) => action.status === "done").length;
  const deferredCount = periodActions.filter((action) => action.status === "deferred").length;
  const highPriorityTodoCount = periodActions.filter(
    (action) => action.priority === "high" && action.status === "todo"
  ).length;
  const highPriorityDoneCount = periodActions.filter(
    (action) => action.priority === "high" && action.status === "done"
  ).length;
  const highPriorityTotal = highPriorityTodoCount + highPriorityDoneCount;
  const summary = calculateMonthlyAccountingSummary(entries, period);
  const kpiSnapshot = {
    revenueTotal: summary.revenueTotal,
    expenseTotal: summary.expenseTotal,
    householdTotal: summary.householdTotal,
    profit: summary.profit,
    estimatedTax: summary.estimatedTax,
    investableAmount: summary.investableAmount,
    expenseRatio: summary.expenseRatio,
    profitMargin: summary.profitMargin
  };

  return {
    period,
    actionSummary: {
      period,
      totalActionCount,
      todoCount,
      doneCount,
      deferredCount,
      highPriorityTodoCount,
      highPriorityDoneCount,
      completionRate: totalActionCount > 0 ? doneCount / totalActionCount : 0,
      highPriorityCompletionRate: highPriorityTotal > 0 ? highPriorityDoneCount / highPriorityTotal : 0
    },
    kpiSnapshot,
    insights: buildInsights({
      completionRate: totalActionCount > 0 ? doneCount / totalActionCount : 0,
      expenseRatio: summary.expenseRatio,
      highPriorityTodoCount,
      investableAmount: summary.investableAmount,
      totalActionCount
    })
  };
}

function buildInsights({
  completionRate,
  expenseRatio,
  highPriorityTodoCount,
  investableAmount,
  totalActionCount
}: {
  completionRate: number;
  expenseRatio: number;
  highPriorityTodoCount: number;
  investableAmount: number;
  totalActionCount: number;
}): ImprovementProgressInsight[] {
  const insights: ImprovementProgressInsight[] = [];

  if (totalActionCount === 0) {
    insights.push({
      id: "no-actions",
      status: "notice",
      title: "改善アクションを作成しましょう",
      message: "改善コメントからアクションを作ると、見直しポイントを行動に変えられます。",
      recommendation: "会計タブの改善コメントから、今月取り組むアクションを作成しましょう。"
    });
  }

  if (completionRate >= 0.7 && totalActionCount > 0) {
    insights.push({
      id: "completion-rate-good",
      status: "good",
      title: "改善アクションが順調に進んでいます",
      message: "今月の改善アクションの多くが完了しています。行動を継続できている状態です。",
      metricLabel: "達成率",
      metricValue: formatPercent(completionRate),
      recommendation: "完了したアクションが数字にどう影響しているか、経費率や投資可能額と一緒に確認しましょう。"
    });
  }

  if (completionRate < 0.3 && totalActionCount >= 3) {
    insights.push({
      id: "completion-rate-low",
      status: "warning",
      title: "未完了アクションが多めです",
      message: "改善アクションが作成されていますが、完了数がまだ少ない状態です。",
      recommendation: "優先度の高いアクションを1つ選び、今日中に完了できる小さな作業に分解しましょう。"
    });
  }

  if (highPriorityTodoCount > 0) {
    insights.push({
      id: "high-priority-todo",
      status: "warning",
      title: "高優先度の未完了アクションがあります",
      message: "利益率や経費率に関わる重要な改善アクションが未完了です。",
      metricLabel: "高優先度 未完了",
      metricValue: `${highPriorityTodoCount}件`,
      recommendation: "高優先度の未完了アクションから先に着手しましょう。"
    });
  }

  if (investableAmount < 0) {
    insights.push({
      id: "negative-investable-amount",
      status: "warning",
      title: "投資可能額が不足しています",
      message: "利益から税金・生活費・事業予備費を差し引くと、投資に回せる余力が不足しています。",
      recommendation: "投資額を増やす前に、固定費・家計支出・事業経費の見直しアクションを優先しましょう。"
    });
  }

  if (expenseRatio >= 0.5) {
    insights.push({
      id: "expense-ratio-high",
      status: "warning",
      title: "経費率の改善余地があります",
      message: "売上に対して経費が大きく、利益を圧迫している可能性があります。",
      metricLabel: "経費率",
      metricValue: formatPercent(expenseRatio),
      recommendation: "経費カテゴリ上位と未完了アクションを見比べ、削減候補を1つ決めましょう。"
    });
  }

  return insights;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
