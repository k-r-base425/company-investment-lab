import type { AccountingEntry, MonthlyAccountingSummary } from "../types/accounting";

export type AccountingSummarySettings = {
  taxRate?: number;
  livingCost?: number;
  businessReserve?: number;
};

const defaultSettings = {
  taxRate: 0.25,
  livingCost: 320000,
  businessReserve: 150000
};

export function calculateMonthlyAccountingSummary(
  entries: AccountingEntry[],
  month: string,
  settings: AccountingSummarySettings = {}
): MonthlyAccountingSummary {
  const mergedSettings = { ...defaultSettings, ...settings };
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const revenueTotal = sumByType(monthlyEntries, "revenue");
  const expenseTotal = sumByType(monthlyEntries, "expense");
  const householdTotal = sumByType(monthlyEntries, "household");
  const profit = revenueTotal - expenseTotal;
  const estimatedTax = profit > 0 ? Math.round(profit * mergedSettings.taxRate) : 0;
  const investableAmount = profit - estimatedTax - mergedSettings.livingCost - mergedSettings.businessReserve;
  const expenseRatio = revenueTotal > 0 ? expenseTotal / revenueTotal : 0;
  const profitMargin = revenueTotal > 0 ? profit / revenueTotal : 0;

  return {
    month,
    revenueTotal,
    expenseTotal,
    householdTotal,
    profit,
    estimatedTax,
    investableAmount,
    expenseRatio,
    profitMargin,
    entryCount: monthlyEntries.length
  };
}

function sumByType(entries: AccountingEntry[], type: AccountingEntry["type"]) {
  return entries
    .filter((entry) => entry.type === type)
    .reduce((total, entry) => total + entry.amount, 0);
}
