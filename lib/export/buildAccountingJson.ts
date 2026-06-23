import { buildAccountingBreakdowns } from "../accounting/buildAccountingBreakdowns";
import { buildAccountingInsights } from "../accounting/buildAccountingInsights";
import { buildCategoryMonthlyComparison } from "../accounting/buildCategoryMonthlyComparison";
import { buildMonthlyComparisonSummary } from "../accounting/buildMonthlyComparisonSummary";
import { buildMonthlyTrendReport } from "../accounting/buildMonthlyTrendReport";
import { buildImprovementActionsSummary } from "../accounting/buildImprovementActionsSummary";
import { calculateMonthlyAccountingSummary } from "../accounting/calculateAccountingSummary";
import { buildImprovementProgressReport } from "../improvement/buildImprovementProgressReport";
import { buildInvestmentAnalysisPayload } from "../investment/buildInvestmentAnalysisPayload";
import type { InvestmentAnalysisDataSource } from "../investment/buildInvestmentAnalysisPayload";
import { sampleInvestmentHoldings } from "../investment/sampleInvestmentHoldings";
import { getPreviousMonth, getPreviousMonthsIncludingSelected } from "../month/monthUtils";
import type { AccountingEntry } from "../types/accounting";
import type { CategoryMonthlyComparisonSummary } from "../types/categoryMonthlyComparison";
import type { ImprovementAction } from "../types/improvementAction";
import type { InvestmentHolding } from "../types/investment";
import type { MonthlyComparisonSummary } from "../types/monthlyComparison";
import type { MonthlyTrendReport } from "../types/monthlyTrendReport";

export function buildAccountingJson(
  entries: AccountingEntry[],
  month: string,
  actions: ImprovementAction[] = [],
  monthlyComparison?: MonthlyComparisonSummary,
  categoryMonthlyComparison?: CategoryMonthlyComparisonSummary,
  monthlyTrendReport?: MonthlyTrendReport,
  investmentHoldings: InvestmentHolding[] = sampleInvestmentHoldings,
  investmentDataSource: InvestmentAnalysisDataSource = "sample"
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
  const categoryComparison =
    categoryMonthlyComparison ??
    buildCategoryMonthlyComparison({
      currentEntries: entries,
      currentMonth: month,
      previousEntries: [],
      previousMonth: getPreviousMonth(month)
    });
  const accountingInsights = buildAccountingInsights({
    categoryMonthlyComparison: categoryComparison,
    entries,
    month,
    monthlyComparison: comparison
  });
  const improvementActions = buildImprovementActionsSummary(actions, month);
  const improvementProgress = buildImprovementProgressReport({ actions, entries, period: month });
  const investment = buildInvestmentAnalysisPayload({
    dataSource: investmentDataSource,
    holdings: investmentHoldings,
    period: month
  });
  const trendReport =
    monthlyTrendReport ??
    buildMonthlyTrendReport({
      entriesByMonth: { [month]: entries },
      months: getPreviousMonthsIncludingSelected(month, 6),
      selectedMonth: month
    });

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
    categoryMonthlyComparison: categoryComparison,
    monthlyComparison: comparison,
    improvementActions,
    improvementProgress,
    investment,
    monthlyTrendReport: trendReport,
    breakdowns,
    entries: monthlyEntries
  };
}
