import { calculateMonthlyAccountingSummary } from "./calculateAccountingSummary";
import { buildAccountingInsights } from "./buildAccountingInsights";
import { buildAccountingBreakdowns } from "./buildAccountingBreakdowns";
import type { AccountingEntry, MonthlyAccountingSummary } from "../types/accounting";
import type { CategoryBreakdownItem, CostBehaviorBreakdown, JudgementBreakdown } from "../types/accountingAnalysis";
import type { AccountingInsight } from "../types/accountingInsight";
import type { MonthlyComparisonSummary } from "../types/monthlyComparison";

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
  accountingInsights: AccountingInsight[];
  recentEntries: AccountingEntry[];
};

export function buildAccountingAnalysisPayload(
  entries: AccountingEntry[],
  month: string,
  monthlyComparison?: MonthlyComparisonSummary
): AccountingAnalysisPayload {
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const summary = calculateMonthlyAccountingSummary(entries, month);
  const breakdowns = buildAccountingBreakdowns(entries, month);
  const accountingInsights = buildAccountingInsights({ entries, month, monthlyComparison });

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
    accountingInsights,
    recentEntries: [...monthlyEntries]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
  };
}
