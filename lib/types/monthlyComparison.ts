export type MonthlyComparisonMetricKey =
  | "revenue"
  | "expense"
  | "household"
  | "profit"
  | "estimatedTax"
  | "investableAmount";

export type MonthlyComparisonTrend =
  | "increased"
  | "decreased"
  | "flat"
  | "no_previous";

export type MonthlyComparisonTone =
  | "positive"
  | "negative"
  | "neutral"
  | "warning";

export type MonthlyComparisonMetric = {
  key: MonthlyComparisonMetricKey;
  label: string;
  currentValue: number;
  previousValue: number | null;
  difference: number | null;
  percentageChange: number | null;
  trend: MonthlyComparisonTrend;
  tone: MonthlyComparisonTone;
  displayValue: string;
  displayDifference: string;
  displayPercentageChange: string;
  note?: string;
};

export type MonthlyComparisonSummary = {
  currentMonth: string;
  previousMonth: string;
  currentEntryCount: number;
  previousEntryCount: number;
  hasPreviousData: boolean;
  metrics: MonthlyComparisonMetric[];
};
