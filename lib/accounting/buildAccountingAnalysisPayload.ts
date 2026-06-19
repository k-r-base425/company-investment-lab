import { calculateMonthlyAccountingSummary } from "./calculateAccountingSummary";
import type { AccountingEntry, AccountingEntryType, CostBehavior, SpendingJudgement } from "../types/accounting";

type CategoryBreakdownItem = {
  category: string;
  amount: number;
  count: number;
};

type AccountingAnalysisPayload = {
  month: string;
  summary: Omit<ReturnType<typeof calculateMonthlyAccountingSummary>, "month" | "entryCount">;
  categoryBreakdown: {
    revenue: CategoryBreakdownItem[];
    expense: CategoryBreakdownItem[];
    household: CategoryBreakdownItem[];
  };
  judgementBreakdown: Record<SpendingJudgement, number>;
  costBehaviorBreakdown: Record<CostBehavior, number>;
  recentEntries: AccountingEntry[];
};

export function buildAccountingAnalysisPayload(entries: AccountingEntry[], month: string): AccountingAnalysisPayload {
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const { month: _month, entryCount: _entryCount, ...summary } = calculateMonthlyAccountingSummary(entries, month);

  return {
    month,
    summary,
    categoryBreakdown: {
      revenue: buildCategoryBreakdown(monthlyEntries, "revenue"),
      expense: buildCategoryBreakdown(monthlyEntries, "expense"),
      household: buildCategoryBreakdown(monthlyEntries, "household")
    },
    judgementBreakdown: buildJudgementBreakdown(monthlyEntries),
    costBehaviorBreakdown: buildCostBehaviorBreakdown(monthlyEntries),
    recentEntries: [...monthlyEntries]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
  };
}

function buildCategoryBreakdown(entries: AccountingEntry[], type: Extract<AccountingEntryType, "revenue" | "expense" | "household">) {
  const map = new Map<string, CategoryBreakdownItem>();

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

  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

function buildJudgementBreakdown(entries: AccountingEntry[]) {
  return entries.reduce<Record<SpendingJudgement, number>>(
    (result, entry) => {
      if (entry.spendingJudgement) {
        result[entry.spendingJudgement] += entry.amount;
      }
      return result;
    },
    { necessary: 0, waste: 0, investment: 0 }
  );
}

function buildCostBehaviorBreakdown(entries: AccountingEntry[]) {
  return entries.reduce<Record<CostBehavior, number>>(
    (result, entry) => {
      if (entry.costBehavior) {
        result[entry.costBehavior] += entry.amount;
      }
      return result;
    },
    { fixed: 0, variable: 0 }
  );
}
