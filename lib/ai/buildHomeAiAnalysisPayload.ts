import { buildAccountingAnalysisPayload } from "../accounting/buildAccountingAnalysisPayload";
import { buildCategoryMonthlyComparison } from "../accounting/buildCategoryMonthlyComparison";
import { buildImprovementActionsSummary } from "../accounting/buildImprovementActionsSummary";
import { buildMonthlyComparisonSummary } from "../accounting/buildMonthlyComparisonSummary";
import { buildMonthlyTrendReport } from "../accounting/buildMonthlyTrendReport";
import { calculateMonthlyAccountingSummary } from "../accounting/calculateAccountingSummary";
import { buildMonthlyChartFromAccountingEntries } from "../home/buildMonthlyChartFromAccountingEntries";
import { buildImprovementProgressReport } from "../improvement/buildImprovementProgressReport";
import { buildInvestmentAnalysisPayload } from "../investment/buildInvestmentAnalysisPayload";
import { sampleInvestmentHoldings } from "../investment/sampleInvestmentHoldings";
import { getPreviousMonth, getPreviousMonthsIncludingSelected } from "../month/monthUtils";
import { sampleAiAnalysisPayload } from "./sampleAiAnalysisPayload";
import type { AccountingEntry } from "../types/accounting";
import type { AiAnalysisPayload } from "../types/ai";
import type { CategoryMonthlyComparisonSummary } from "../types/categoryMonthlyComparison";
import type { ImprovementAction } from "../types/improvementAction";
import type { InvestmentHolding } from "../types/investment";
import type { MonthlyComparisonSummary } from "../types/monthlyComparison";
import type { MonthlyTrendReport } from "../types/monthlyTrendReport";

export function buildHomeAiAnalysisPayload(
  entries: AccountingEntry[],
  month: string,
  actions: ImprovementAction[] = [],
  monthlyComparison?: MonthlyComparisonSummary,
  categoryMonthlyComparison?: CategoryMonthlyComparisonSummary,
  monthlyTrendReport?: MonthlyTrendReport,
  investmentHoldings: InvestmentHolding[] = sampleInvestmentHoldings
): AiAnalysisPayload {
  const previousMonth = getPreviousMonth(month);
  const comparison =
    monthlyComparison ??
    buildMonthlyComparisonSummary({
      currentMonth: month,
      currentSummary: calculateMonthlyAccountingSummary(entries, month),
      previousMonth,
      previousSummary: null
    });
  const categoryComparison =
    categoryMonthlyComparison ??
    buildCategoryMonthlyComparison({
      currentEntries: entries,
      currentMonth: month,
      previousEntries: [],
      previousMonth
    });
  const accountingAnalysis = buildAccountingAnalysisPayload(entries, month, comparison, categoryComparison);
  const { summary, categoryBreakdown } = accountingAnalysis;
  const householdCostBreakdown = buildHouseholdCostBreakdown(entries, month);
  const monthlyChartData = buildMonthlyChartFromAccountingEntries({ entries, metric: "profit", month });
  const improvementActions = buildImprovementActionsSummary(actions, month);
  const improvementProgress = buildImprovementProgressReport({ actions, entries, period: month });
  const investment = buildInvestmentAnalysisPayload(investmentHoldings);
  const trendReport =
    monthlyTrendReport ??
    buildMonthlyTrendReport({
      entriesByMonth: { [month]: entries },
      months: getPreviousMonthsIncludingSelected(month, 6),
      selectedMonth: month
    });

  return {
    ...sampleAiAnalysisPayload,
    period: month,
    business: {
      revenue: summary.revenueTotal,
      expenses: summary.expenseTotal,
      profit: summary.profit,
      estimatedTax: summary.estimatedTax,
      investableAmount: summary.investableAmount,
      expenseRatio: summary.expenseRatio,
      profitMargin: summary.profitMargin
    },
    household: {
      totalSpending: summary.householdTotal,
      fixedCost: householdCostBreakdown.fixed,
      variableCost: householdCostBreakdown.variable,
      categories: categoryBreakdown.household.map((item) => ({
        name: item.category,
        amount: item.amount
      }))
    },
    accountingAnalysis,
    accountingInsights: accountingAnalysis.accountingInsights,
    categoryMonthlyComparison: categoryComparison,
    monthlyComparison: comparison,
    improvementActions,
    improvementProgress,
    investment,
    monthlyTrendReport: trendReport,
    monthlyChart: {
      month,
      metric: "profit",
      unit: "day",
      notes: "保存済み会計入力データから生成。未入力日は null。status は high / middle / low / empty。",
      days: monthlyChartData.days
    }
  };
}

function buildHouseholdCostBreakdown(entries: AccountingEntry[], month: string) {
  return entries
    .filter((entry) => entry.type === "household" && entry.date.startsWith(month))
    .reduce(
      (result, entry) => {
        if (entry.costBehavior === "fixed") {
          result.fixed += entry.amount;
          return result;
        }

        result.variable += entry.amount;
        return result;
      },
      { fixed: 0, variable: 0 }
    );
}
