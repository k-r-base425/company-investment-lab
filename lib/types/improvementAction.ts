import type { AccountingInsightCategory } from "./accountingInsight";

export type ImprovementActionStatus = "todo" | "done" | "deferred";

export type ImprovementActionSource = "accounting_insight" | "ai_analysis" | "manual";

export type ImprovementActionCategory = AccountingInsightCategory | "other";

export type ImprovementActionPriority = "high" | "medium" | "low";

export type ImprovementAction = {
  id: string;
  period: string;
  title: string;
  description?: string;
  category: ImprovementActionCategory;
  source: ImprovementActionSource;
  status: ImprovementActionStatus;
  priority: ImprovementActionPriority;
  sourceInsightId?: string;
  sourceInsightTitle?: string;
  sourceActionIndex?: number;
  actionKey?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateImprovementActionStatusParams = {
  id: string;
  status: ImprovementActionStatus;
};
