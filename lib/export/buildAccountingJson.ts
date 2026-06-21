import { buildAccountingBreakdowns } from "../accounting/buildAccountingBreakdowns";
import { buildAccountingInsights } from "../accounting/buildAccountingInsights";
import { calculateMonthlyAccountingSummary } from "../accounting/calculateAccountingSummary";
import type { AccountingEntry } from "../types/accounting";

export function buildAccountingJson(entries: AccountingEntry[], month: string) {
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const breakdowns = buildAccountingBreakdowns(entries, month);
  const accountingInsights = buildAccountingInsights({ entries, month });

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
    breakdowns,
    entries: monthlyEntries
  };
}
