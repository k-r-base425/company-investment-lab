import { buildAccountingBreakdowns } from "../accounting/buildAccountingBreakdowns";
import { buildAccountingInsights } from "../accounting/buildAccountingInsights";
import { buildImprovementActionsSummary } from "../accounting/buildImprovementActionsSummary";
import { calculateMonthlyAccountingSummary } from "../accounting/calculateAccountingSummary";
import type { AccountingEntry } from "../types/accounting";
import type { ImprovementAction } from "../types/improvementAction";

export function buildAccountingJson(entries: AccountingEntry[], month: string, actions: ImprovementAction[] = []) {
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const breakdowns = buildAccountingBreakdowns(entries, month);
  const accountingInsights = buildAccountingInsights({ entries, month });
  const improvementActions = buildImprovementActionsSummary(actions, month);

  return {
    month,
    summary: calculateMonthlyAccountingSummary(entries, month),
    categoryBreakdown: {
      revenue: breakdowns.revenueCategories,
      expense: breakdowns.expenseCategories,
      household: breakdowns.householdCategories
    },
    judgementBreakdown: breakdowns.judgementBreakdown,
    costBehaviorBreakdown: breakdowns.costBehaviorBreakdown,
    accountingInsights,
    improvementActions,
    breakdowns,
    entries: monthlyEntries
  };
}
