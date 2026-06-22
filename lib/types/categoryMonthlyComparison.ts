export type CategoryComparisonGroup =
  | "revenue"
  | "expense"
  | "household";

export type CategoryComparisonTrend =
  | "increased"
  | "decreased"
  | "flat"
  | "new"
  | "disappeared"
  | "no_previous";

export type CategoryComparisonTone =
  | "positive"
  | "negative"
  | "neutral"
  | "warning";

export type CategoryMonthlyComparisonItem = {
  category: string;
  group: CategoryComparisonGroup;
  currentAmount: number;
  previousAmount: number | null;
  difference: number | null;
  percentageChange: number | null;
  currentCount: number;
  previousCount: number;
  trend: CategoryComparisonTrend;
  tone: CategoryComparisonTone;
  displayCurrentAmount: string;
  displayPreviousAmount: string;
  displayDifference: string;
  displayPercentageChange: string;
  note?: string;
};

export type CategoryMonthlyComparisonSummary = {
  currentMonth: string;
  previousMonth: string;
  hasPreviousData: boolean;
  revenueCategories: CategoryMonthlyComparisonItem[];
  expenseCategories: CategoryMonthlyComparisonItem[];
  householdCategories: CategoryMonthlyComparisonItem[];
  increasedExpenseCategories: CategoryMonthlyComparisonItem[];
  decreasedExpenseCategories: CategoryMonthlyComparisonItem[];
  increasedHouseholdCategories: CategoryMonthlyComparisonItem[];
  decreasedHouseholdCategories: CategoryMonthlyComparisonItem[];
};
