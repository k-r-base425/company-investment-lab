import { buildAccountingAnalysisPayload } from "../accounting/buildAccountingAnalysisPayload";
import { buildImprovementActionsSummary } from "../accounting/buildImprovementActionsSummary";
import { buildMonthlyComparisonSummary } from "../accounting/buildMonthlyComparisonSummary";
import { calculateMonthlyAccountingSummary } from "../accounting/calculateAccountingSummary";
import { buildMonthlyChartFromAccountingEntries } from "../home/buildMonthlyChartFromAccountingEntries";
import { buildImprovementProgressReport } from "../improvement/buildImprovementProgressReport";
import { getPreviousMonth } from "../month/monthUtils";
import { sampleAiAnalysisPayload } from "./sampleAiAnalysisPayload";
import type { AccountingEntry } from "../types/accounting";
import type { AiAnalysisPayload } from "../types/ai";
import type { ImprovementAction } from "../types/improvementAction";
import type { MonthlyComparisonSummary } from "../types/monthlyComparison";

export function buildHomeAiAnalysisPayload(
  entries: AccountingEntry[],
  month: string,
  actions: ImprovementAction[] = [],
  monthlyComparison?: MonthlyComparisonSummary
): AiAnalysisPayload {
  const comparison =
    monthlyComparison ??
    buildMonthlyComparisonSummary({
      currentMonth: month,
      currentSummary: calculateMonthlyAccountingSummary(entries, month),
      previousMonth: getPreviousMonth(month),
      previousSummary: null
    });
  const accountingAnalysis = buildAccountingAnalysisPayload(entries, month, comparison);
  const { summary, categoryBreakdown } = accountingAnalysis;
  const householdCostBreakdown = buildHouseholdCostBreakdown(entries, month);
  const monthlyChartData = buildMonthlyChartFromAccountingEntries({ entries, metric: "profit", month });
  const improvementActions = buildImprovementActionsSummary(actions, month);
  const improvementProgress = buildImprovementProgressReport({ actions, entries, period: month });

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
    monthlyComparison: comparison,
    improvementActions,
    improvementProgress,
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
