import type { CostBehavior, SpendingJudgement } from "./accounting";

export type CategoryBreakdownItem = {
  category: string;
  amount: number;
  count: number;
  ratio: number;
};

export type JudgementBreakdown = Record<SpendingJudgement, number>;

export type CostBehaviorBreakdown = Record<CostBehavior, number>;

export type AccountingBreakdowns = {
  month: string;
  revenueCategories: CategoryBreakdownItem[];
  expenseCategories: CategoryBreakdownItem[];
  householdCategories: CategoryBreakdownItem[];
  judgementBreakdown: JudgementBreakdown;
  costBehaviorBreakdown: CostBehaviorBreakdown;
};
