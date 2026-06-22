import type { YearMonth } from "../types/month";

export const defaultSelectedMonth: YearMonth = "2026-06";

export function formatYearMonthLabel(month: YearMonth): string {
  const normalized = normalizeYearMonth(month) ?? defaultSelectedMonth;
  const [yearText, monthText] = normalized.split("-");
  return `${Number(yearText)}年${Number(monthText)}月`;
}

export function getPreviousMonth(month: YearMonth): YearMonth {
  const normalized = normalizeYearMonth(month) ?? defaultSelectedMonth;
  const [yearText, monthText] = normalized.split("-");
  const date = new Date(Number(yearText), Number(monthText) - 2, 1);
  return formatYearMonth(date.getFullYear(), date.getMonth() + 1);
}

export function getNextMonth(month: YearMonth): YearMonth {
  const normalized = normalizeYearMonth(month) ?? defaultSelectedMonth;
  const [yearText, monthText] = normalized.split("-");
  const date = new Date(Number(yearText), Number(monthText), 1);
  return formatYearMonth(date.getFullYear(), date.getMonth() + 1);
}

export function getPreviousMonthsIncludingSelected(month: YearMonth, count: number): YearMonth[] {
  const normalized = normalizeYearMonth(month) ?? defaultSelectedMonth;
  const safeCount = Math.max(1, Math.floor(count));
  const [yearText, monthText] = normalized.split("-");
  const selectedDate = new Date(Number(yearText), Number(monthText) - 1, 1);

  return Array.from({ length: safeCount }, (_, index) => {
    const monthOffset = safeCount - 1 - index;
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - monthOffset, 1);
    return formatYearMonth(date.getFullYear(), date.getMonth() + 1);
  });
}

export function getMonthDateRange(month: YearMonth) {
  const normalized = normalizeYearMonth(month) ?? defaultSelectedMonth;
  const [yearText, monthText] = normalized.split("-");
  const year = Number(yearText);
  const monthNumber = Number(monthText);
  const dayCount = new Date(year, monthNumber, 0).getDate();

  return {
    startDate: `${normalized}-01`,
    endDate: `${normalized}-${String(dayCount).padStart(2, "0")}`,
    dayCount
  };
}

export function isDateInMonth(date: string, month: YearMonth): boolean {
  const normalized = normalizeYearMonth(month) ?? defaultSelectedMonth;
  return date.startsWith(normalized);
}

export function createMonthDays(month: YearMonth): { date: string; day: number }[] {
  const normalized = normalizeYearMonth(month) ?? defaultSelectedMonth;
  const { dayCount } = getMonthDateRange(normalized);

  return Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1;
    return {
      date: `${normalized}-${String(day).padStart(2, "0")}`,
      day
    };
  });
}

export function normalizeYearMonth(input: string): YearMonth | null {
  const match = input.trim().match(/^(\d{4})-(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return formatYearMonth(year, month);
}

function formatYearMonth(year: number, month: number): YearMonth {
  return `${year}-${String(month).padStart(2, "0")}`;
}
