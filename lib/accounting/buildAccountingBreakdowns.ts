import type { AccountingEntry, AccountingEntryType, CostBehavior, SpendingJudgement } from "../types/accounting";
import type { AccountingBreakdowns, CategoryBreakdownItem } from "../types/accountingAnalysis";

type BreakDownCategoryType = Extract<AccountingEntryType, "revenue" | "expense" | "household">;

export function buildAccountingBreakdowns(entries: AccountingEntry[], month: string): AccountingBreakdowns {
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const revenueEntries = monthlyEntries.filter((entry) => entry.type === "revenue");
  const expenseEntries = monthlyEntries.filter((entry) => entry.type === "expense");
  const householdEntries = monthlyEntries.filter((entry) => entry.type === "household");
  const spendingEntries = monthlyEntries.filter((entry) => entry.type === "expense" || entry.type === "household");

  return {
    month,
    revenueCategories: buildCategoryBreakdown(revenueEntries, "revenue"),
    expenseCategories: buildCategoryBreakdown(expenseEntries, "expense"),
    householdCategories: buildCategoryBreakdown(householdEntries, "household"),
    judgementBreakdown: buildJudgementBreakdown(spendingEntries),
    costBehaviorBreakdown: buildCostBehaviorBreakdown(spendingEntries)
  };
}

function buildCategoryBreakdown(entries: AccountingEntry[], type: BreakDownCategoryType) {
  const totalAmount = entries.reduce((total, entry) => total + entry.amount, 0);
  const map = new Map<string, Omit<CategoryBreakdownItem, "ratio">>();

  entries
    .filter((entry) => entry.type === type)
    .forEach((entry) => {
      const category = entry.category ?? "未分類";
      const current = map.get(category) ?? { category, amount: 0, count: 0 };
      map.set(category, {
        category,
        amount: current.amount + entry.amount,
        count: current.count + 1
      });
    });

  return [...map.values()]
    .map((item) => ({
      ...item,
      ratio: totalAmount > 0 ? item.amount / totalAmount : 0
    }))
    .sort((a, b) => b.amount - a.amount);
}

function buildJudgementBreakdown(entries: AccountingEntry[]) {
  return entries.reduce<Record<SpendingJudgement, number>>(
    (result, entry) => {
      const judgement = entry.spendingJudgement ?? "necessary";
      result[judgement] += entry.amount;
      return result;
    },
    { necessary: 0, waste: 0, investment: 0 }
  );
}

function buildCostBehaviorBreakdown(entries: AccountingEntry[]) {
  return entries.reduce<Record<CostBehavior, number>>(
    (result, entry) => {
      const behavior = entry.costBehavior ?? "variable";
      result[behavior] += entry.amount;
      return result;
    },
    { fixed: 0, variable: 0 }
  );
}
