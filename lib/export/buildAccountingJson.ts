import { buildAccountingBreakdowns } from "../accounting/buildAccountingBreakdowns";
import { buildAccountingInsights } from "../accounting/buildAccountingInsights";
import { buildMonthlyComparisonSummary } from "../accounting/buildMonthlyComparisonSummary";
import { buildImprovementActionsSummary } from "../accounting/buildImprovementActionsSummary";
import { calculateMonthlyAccountingSummary } from "../accounting/calculateAccountingSummary";
import { buildImprovementProgressReport } from "../improvement/buildImprovementProgressReport";
import { getPreviousMonth } from "../month/monthUtils";
import type { AccountingEntry } from "../types/accounting";
import type { ImprovementAction } from "../types/improvementAction";
import type { MonthlyComparisonSummary } from "../types/monthlyComparison";

export function buildAccountingJson(
  entries: AccountingEntry[],
  month: string,
  actions: ImprovementAction[] = [],
  monthlyComparison?: MonthlyComparisonSummary
) {
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const breakdowns = buildAccountingBreakdowns(entries, month);
  const summary = calculateMonthlyAccountingSummary(entries, month);
  const comparison =
    monthlyComparison ??
    buildMonthlyComparisonSummary({
      currentMonth: month,
      currentSummary: summary,
      previousMonth: getPreviousMonth(month),
      previousSummary: null
    });
  const accountingInsights = buildAccountingInsights({ entries, month, monthlyComparison: comparison });
  const improvementActions = buildImprovementActionsSummary(actions, month);
  const improvementProgress = buildImprovementProgressReport({ actions, entries, period: month });

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
    monthlyComparison: comparison,
    improvementActions,
    improvementProgress,
    breakdowns,
    entries: monthlyEntries
  };
}
