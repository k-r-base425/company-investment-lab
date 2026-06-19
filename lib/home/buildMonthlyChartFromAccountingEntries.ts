import type { AccountingEntry } from "../types/accounting";
import type { MonthlyChartData, MonthlyChartDay, MonthlyChartMetric, MonthlyChartStatus } from "../types/monthlyChart";

type BuildMonthlyChartFromAccountingEntriesParams = {
  entries: AccountingEntry[];
  metric: MonthlyChartMetric;
  month: string;
};

type DayTotals = {
  revenueTotal: number;
  expenseTotal: number;
  householdTotal: number;
  entryCount: number;
  revenueEntryCount: number;
  expenseEntryCount: number;
  householdEntryCount: number;
};

export function buildMonthlyChartFromAccountingEntries({
  entries,
  metric,
  month
}: BuildMonthlyChartFromAccountingEntriesParams): MonthlyChartData {
  const daysInMonth = getDaysInMonth(month);
  const totalsByDay = buildTotalsByDay(entries, month);
  const baseDays: MonthlyChartDay[] = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${month}-${String(day).padStart(2, "0")}`;
    const totals = totalsByDay.get(day) ?? createEmptyDayTotals();
    const profit = totals.revenueTotal - totals.expenseTotal;
    const hasInputForMetric = getHasInputForMetric(totals, metric);
    const value = hasInputForMetric ? getMetricValue({ metric, profit, totals }) : null;

    return {
      date,
      day,
      value,
      status: "empty",
      revenueTotal: totals.revenueTotal,
      expenseTotal: totals.expenseTotal,
      householdTotal: totals.householdTotal,
      profit,
      entryCount: totals.entryCount
    };
  });
  const days = applyStatuses(baseDays);
  const filledValues = days
    .map((day) => day.value)
    .filter((value): value is number => value !== null);
  const total = filledValues.reduce((sum, value) => sum + value, 0);
  const maxValue = Math.max(0, ...filledValues.map((value) => Math.abs(value)));

  return {
    month,
    metric,
    days,
    maxValue,
    total,
    average: filledValues.length > 0 ? total / filledValues.length : 0,
    filledDayCount: filledValues.length
  };
}

function buildTotalsByDay(entries: AccountingEntry[], month: string) {
  const totalsByDay = new Map<number, DayTotals>();

  entries
    .filter((entry) => entry.date.startsWith(month))
    .forEach((entry) => {
      const day = Number(entry.date.slice(8, 10));
      if (!Number.isInteger(day) || day < 1) {
        return;
      }

      const totals = totalsByDay.get(day) ?? createEmptyDayTotals();
      totals.entryCount += 1;

      if (entry.type === "revenue") {
        totals.revenueTotal += entry.amount;
        totals.revenueEntryCount += 1;
      }

      if (entry.type === "expense") {
        totals.expenseTotal += entry.amount;
        totals.expenseEntryCount += 1;
      }

      if (entry.type === "household") {
        totals.householdTotal += entry.amount;
        totals.householdEntryCount += 1;
      }

      totalsByDay.set(day, totals);
    });

  return totalsByDay;
}

function applyStatuses(days: MonthlyChartDay[]) {
  const filledDays = days
    .filter((day) => day.value !== null)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  if (filledDays.length === 0) {
    return days;
  }

  const statusByDate = new Map<string, MonthlyChartStatus>();

  if (filledDays.length === 1) {
    statusByDate.set(filledDays[0].date, "high");
    return days.map((day) => ({ ...day, status: statusByDate.get(day.date) ?? day.status }));
  }

  if (filledDays.length === 2) {
    statusByDate.set(filledDays[0].date, "high");
    statusByDate.set(filledDays[1].date, "low");
    return days.map((day) => ({ ...day, status: statusByDate.get(day.date) ?? day.status }));
  }

  const highCount = Math.max(1, Math.floor(filledDays.length * 0.33));
  const lowCount = Math.max(1, Math.floor(filledDays.length * 0.33));
  const lowStartIndex = filledDays.length - lowCount;

  filledDays.forEach((day, index) => {
    if (index < highCount) {
      statusByDate.set(day.date, "high");
      return;
    }

    if (index >= lowStartIndex) {
      statusByDate.set(day.date, "low");
      return;
    }

    statusByDate.set(day.date, "middle");
  });

  return days.map((day) => ({ ...day, status: statusByDate.get(day.date) ?? day.status }));
}

function getHasInputForMetric(totals: DayTotals, metric: MonthlyChartMetric) {
  switch (metric) {
    case "revenue":
      return totals.revenueEntryCount > 0;
    case "expense":
      return totals.expenseEntryCount > 0;
    case "profit":
      return totals.revenueEntryCount > 0 || totals.expenseEntryCount > 0;
    case "household":
      return totals.householdEntryCount > 0;
    default:
      return false;
  }
}

function getMetricValue({
  metric,
  profit,
  totals
}: {
  metric: MonthlyChartMetric;
  profit: number;
  totals: DayTotals;
}) {
  switch (metric) {
    case "revenue":
      return totals.revenueTotal;
    case "expense":
      return totals.expenseTotal;
    case "profit":
      return profit;
    case "household":
      return totals.householdTotal;
    default:
      return 0;
  }
}

function createEmptyDayTotals(): DayTotals {
  return {
    revenueTotal: 0,
    expenseTotal: 0,
    householdTotal: 0,
    entryCount: 0,
    revenueEntryCount: 0,
    expenseEntryCount: 0,
    householdEntryCount: 0
  };
}

function getDaysInMonth(month: string) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthNumber = Number(monthText);

  if (!Number.isInteger(year) || !Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return 30;
  }

  return new Date(year, monthNumber, 0).getDate();
}
