import { buildAccountingAnalysisPayload } from "../accounting/buildAccountingAnalysisPayload";
import { sampleAiAnalysisPayload } from "./sampleAiAnalysisPayload";
import type { AccountingEntry } from "../types/accounting";
import type { AiAnalysisPayload } from "../types/ai";

export function buildHomeAiAnalysisPayload(entries: AccountingEntry[], month: string): AiAnalysisPayload {
  const accountingAnalysis = buildAccountingAnalysisPayload(entries, month);
  const { summary, categoryBreakdown } = accountingAnalysis;
  const householdCostBreakdown = buildHouseholdCostBreakdown(entries, month);

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
    accountingAnalysis
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
