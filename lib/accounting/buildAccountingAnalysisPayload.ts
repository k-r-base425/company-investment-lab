import { calculateMonthlyAccountingSummary } from "./calculateAccountingSummary";
import { buildAccountingBreakdowns } from "./buildAccountingBreakdowns";
import type { AccountingEntry, MonthlyAccountingSummary } from "../types/accounting";
import type { CategoryBreakdownItem, CostBehaviorBreakdown, JudgementBreakdown } from "../types/accountingAnalysis";

export type AccountingAnalysisPayload = {
  month: string;
  summary: MonthlyAccountingSummary;
  categoryBreakdown: {
    revenue: CategoryBreakdownItem[];
    expense: CategoryBreakdownItem[];
    household: CategoryBreakdownItem[];
  };
  judgementBreakdown: JudgementBreakdown;
  costBehaviorBreakdown: CostBehaviorBreakdown;
  recentEntries: AccountingEntry[];
};

export function buildAccountingAnalysisPayload(entries: AccountingEntry[], month: string): AccountingAnalysisPayload {
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const summary = calculateMonthlyAccountingSummary(entries, month);
  const breakdowns = buildAccountingBreakdowns(entries, month);

  return {
    month,
    summary,
    categoryBreakdown: {
      revenue: breakdowns.revenueCategories,
      expense: breakdowns.expenseCategories,
      household: breakdowns.householdCategories
    },
    judgementBreakdown: breakdowns.judgementBreakdown,
    costBehaviorBreakdown: breakdowns.costBehaviorBreakdown,
    recentEntries: [...monthlyEntries]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
  };
}
