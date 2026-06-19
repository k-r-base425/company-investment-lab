export type MonthlyChartMetric = "revenue" | "expense" | "profit" | "household";

export type MonthlyChartStatus = "high" | "middle" | "low" | "empty";

export type MonthlyChartDay = {
  date: string;
  day: number;
  value: number | null;
  status: MonthlyChartStatus;
  revenueTotal: number;
  expenseTotal: number;
  householdTotal: number;
  profit: number;
  entryCount: number;
};

export type MonthlyChartData = {
  month: string;
  metric: MonthlyChartMetric;
  days: MonthlyChartDay[];
  maxValue: number;
  total: number;
  average: number;
  filledDayCount: number;
};
