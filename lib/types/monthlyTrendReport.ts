export type MonthlyTrendMetricKey =
  | "revenue"
  | "expense"
  | "household"
  | "profit"
  | "estimatedTax"
  | "investableAmount";

export type MonthlyTrendDirection =
  | "up"
  | "down"
  | "flat"
  | "mixed"
  | "insufficient_data";

export type MonthlyTrendPoint = {
  month: string;
  monthLabel: string;
  entryCount: number;
  hasData: boolean;
  revenueTotal: number;
  expenseTotal: number;
  householdTotal: number;
  profit: number;
  estimatedTax: number;
  investableAmount: number;
  expenseRatio: number;
  profitMargin: number;
};

export type MonthlyTrendMetricSummary = {
  key: MonthlyTrendMetricKey;
  label: string;
  currentValue: number;
  previousValue: number | null;
  minValue: number;
  maxValue: number;
  averageValue: number;
  totalValue: number;
  direction: MonthlyTrendDirection;
  currentDisplayValue: string;
  averageDisplayValue: string;
  note?: string;
};

export type MonthlyTrendReport = {
  selectedMonth: string;
  selectedMonthLabel: string;
  months: string[];
  points: MonthlyTrendPoint[];
  metricSummaries: MonthlyTrendMetricSummary[];
  dataMonthCount: number;
  emptyMonthCount: number;
  generatedAt: string;
};
