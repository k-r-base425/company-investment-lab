export type ImprovementProgressStatus = "good" | "notice" | "warning";

export type ImprovementProgressSummary = {
  period: string;
  totalActionCount: number;
  todoCount: number;
  doneCount: number;
  deferredCount: number;
  highPriorityTodoCount: number;
  highPriorityDoneCount: number;
  completionRate: number;
  highPriorityCompletionRate: number;
};

export type ImprovementKpiSnapshot = {
  revenueTotal: number;
  expenseTotal: number;
  householdTotal: number;
  profit: number;
  estimatedTax: number;
  investableAmount: number;
  expenseRatio: number;
  profitMargin: number;
};

export type ImprovementProgressInsight = {
  id: string;
  status: ImprovementProgressStatus;
  title: string;
  message: string;
  metricLabel?: string;
  metricValue?: string;
  recommendation: string;
};

export type ImprovementProgressReport = {
  period: string;
  actionSummary: ImprovementProgressSummary;
  kpiSnapshot: ImprovementKpiSnapshot;
  insights: ImprovementProgressInsight[];
};
