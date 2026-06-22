import type { AccountingEntry } from "../types/accounting";
import type {
  CategoryComparisonGroup,
  CategoryComparisonTone,
  CategoryComparisonTrend,
  CategoryMonthlyComparisonItem,
  CategoryMonthlyComparisonSummary
} from "../types/categoryMonthlyComparison";

type BuildCategoryMonthlyComparisonParams = {
  currentEntries: AccountingEntry[];
  previousEntries: AccountingEntry[];
  currentMonth: string;
  previousMonth: string;
};

type CategoryAggregate = {
  amount: number;
  count: number;
};

const groups: CategoryComparisonGroup[] = ["revenue", "expense", "household"];

export function buildCategoryMonthlyComparison({
  currentEntries,
  previousEntries,
  currentMonth,
  previousMonth
}: BuildCategoryMonthlyComparisonParams): CategoryMonthlyComparisonSummary {
  const hasPreviousData = previousEntries.some((entry) => entry.date.startsWith(previousMonth));
  const currentByGroup = buildGroupedAggregates(currentEntries, currentMonth);
  const previousByGroup = buildGroupedAggregates(previousEntries, previousMonth);
  const revenueCategories = buildGroupItems({
    current: currentByGroup.revenue,
    group: "revenue",
    hasPreviousData,
    previous: previousByGroup.revenue
  });
  const expenseCategories = buildGroupItems({
    current: currentByGroup.expense,
    group: "expense",
    hasPreviousData,
    previous: previousByGroup.expense
  });
  const householdCategories = buildGroupItems({
    current: currentByGroup.household,
    group: "household",
    hasPreviousData,
    previous: previousByGroup.household
  });

  return {
    currentMonth,
    previousMonth,
    hasPreviousData,
    revenueCategories,
    expenseCategories,
    householdCategories,
    increasedExpenseCategories: expenseCategories
      .filter((item) => item.trend === "increased" || item.trend === "new")
      .sort(sortByIncreaseMagnitude),
    decreasedExpenseCategories: expenseCategories
      .filter((item) => item.trend === "decreased" || item.trend === "disappeared")
      .sort(sortByDecreaseMagnitude),
    increasedHouseholdCategories: householdCategories
      .filter((item) => item.trend === "increased" || item.trend === "new")
      .sort(sortByIncreaseMagnitude),
    decreasedHouseholdCategories: householdCategories
      .filter((item) => item.trend === "decreased" || item.trend === "disappeared")
      .sort(sortByDecreaseMagnitude)
  };
}

function buildGroupedAggregates(entries: AccountingEntry[], month: string) {
  return groups.reduce<Record<CategoryComparisonGroup, Map<string, CategoryAggregate>>>(
    (result, group) => {
      result[group] = buildCategoryAggregate(entries, month, group);
      return result;
    },
    {
      revenue: new Map<string, CategoryAggregate>(),
      expense: new Map<string, CategoryAggregate>(),
      household: new Map<string, CategoryAggregate>()
    }
  );
}

function buildCategoryAggregate(entries: AccountingEntry[], month: string, group: CategoryComparisonGroup) {
  const aggregate = new Map<string, CategoryAggregate>();

  entries
    .filter((entry) => entry.type === group && entry.date.startsWith(month))
    .forEach((entry) => {
      const category = entry.category?.trim() || "未分類";
      const current = aggregate.get(category) ?? { amount: 0, count: 0 };
      aggregate.set(category, {
        amount: current.amount + entry.amount,
        count: current.count + 1
      });
    });

  return aggregate;
}

function buildGroupItems({
  current,
  group,
  hasPreviousData,
  previous
}: {
  current: Map<string, CategoryAggregate>;
  group: CategoryComparisonGroup;
  hasPreviousData: boolean;
  previous: Map<string, CategoryAggregate>;
}) {
  const categories = new Set([...current.keys(), ...(hasPreviousData ? previous.keys() : [])]);

  return [...categories]
    .map((category) =>
      buildItem({
        category,
        currentAggregate: current.get(category),
        group,
        hasPreviousData,
        previousAggregate: previous.get(category)
      })
    )
    .sort(sortByAbsoluteChange);
}

function buildItem({
  category,
  currentAggregate,
  group,
  hasPreviousData,
  previousAggregate
}: {
  category: string;
  currentAggregate: CategoryAggregate | undefined;
  group: CategoryComparisonGroup;
  hasPreviousData: boolean;
  previousAggregate: CategoryAggregate | undefined;
}): CategoryMonthlyComparisonItem {
  const currentAmount = currentAggregate?.amount ?? 0;
  const currentCount = currentAggregate?.count ?? 0;
  const previousAmount = hasPreviousData ? previousAggregate?.amount ?? null : null;
  const previousCount = previousAggregate?.count ?? 0;
  const trend = getTrend({ currentAggregate, currentAmount, hasPreviousData, previousAggregate, previousAmount });
  const difference = previousAmount === null ? null : currentAmount - previousAmount;
  const percentageChange =
    previousAmount === null || previousAmount === 0 || difference === null
      ? null
      : difference / Math.abs(previousAmount);

  return {
    category,
    group,
    currentAmount,
    previousAmount,
    difference,
    percentageChange,
    currentCount,
    previousCount,
    trend,
    tone: getTone(group, trend),
    displayCurrentAmount: trend === "disappeared" ? "今月なし" : formatYen(currentAmount),
    displayPreviousAmount: getPreviousDisplay(previousAmount, trend),
    displayDifference: getDifferenceDisplay(difference, trend),
    displayPercentageChange: getPercentageDisplay(percentageChange, trend, previousAmount),
    note: previousAmount === 0 ? "前月が0円のため増減率は比較不可です。" : undefined
  };
}

function getTrend({
  currentAggregate,
  currentAmount,
  hasPreviousData,
  previousAggregate,
  previousAmount
}: {
  currentAggregate: CategoryAggregate | undefined;
  currentAmount: number;
  hasPreviousData: boolean;
  previousAggregate: CategoryAggregate | undefined;
  previousAmount: number | null;
}): CategoryComparisonTrend {
  if (!hasPreviousData) {
    return "no_previous";
  }

  if (!previousAggregate && currentAggregate) {
    return "new";
  }

  if (previousAggregate && !currentAggregate) {
    return "disappeared";
  }

  if (previousAmount === null) {
    return "new";
  }

  const difference = currentAmount - previousAmount;

  if (difference > 0) {
    return "increased";
  }

  if (difference < 0) {
    return "decreased";
  }

  return "flat";
}

function getTone(group: CategoryComparisonGroup, trend: CategoryComparisonTrend): CategoryComparisonTone {
  if (trend === "flat" || trend === "no_previous") {
    return "neutral";
  }

  if (group === "revenue") {
    return trend === "increased" || trend === "new" ? "positive" : "warning";
  }

  return trend === "increased" || trend === "new" ? "warning" : "positive";
}

function getPreviousDisplay(previousAmount: number | null, trend: CategoryComparisonTrend) {
  if (trend === "no_previous") {
    return "前月データなし";
  }

  if (trend === "new") {
    return "新規";
  }

  return previousAmount === null ? "前月データなし" : formatYen(previousAmount);
}

function getDifferenceDisplay(difference: number | null, trend: CategoryComparisonTrend) {
  if (trend === "no_previous") {
    return "前月データなし";
  }

  if (trend === "new") {
    return "新規";
  }

  if (difference === null) {
    return "前月データなし";
  }

  return formatDifference(difference);
}

function getPercentageDisplay(
  percentageChange: number | null,
  trend: CategoryComparisonTrend,
  previousAmount: number | null
) {
  if (trend === "no_previous") {
    return "前月データなし";
  }

  if (trend === "new") {
    return "新規";
  }

  if (previousAmount === 0) {
    return "比較不可";
  }

  if (percentageChange === null) {
    return "前月データなし";
  }

  return formatPercentageChange(percentageChange);
}

function sortByAbsoluteChange(a: CategoryMonthlyComparisonItem, b: CategoryMonthlyComparisonItem) {
  return getChangeMagnitude(b) - getChangeMagnitude(a);
}

function sortByIncreaseMagnitude(a: CategoryMonthlyComparisonItem, b: CategoryMonthlyComparisonItem) {
  return getChangeMagnitude(b) - getChangeMagnitude(a);
}

function sortByDecreaseMagnitude(a: CategoryMonthlyComparisonItem, b: CategoryMonthlyComparisonItem) {
  return getChangeMagnitude(b) - getChangeMagnitude(a);
}

function getChangeMagnitude(item: CategoryMonthlyComparisonItem) {
  if (item.difference !== null) {
    return Math.abs(item.difference);
  }

  return item.currentAmount;
}

function formatYen(value: number) {
  const rounded = Math.round(value);
  const absolute = Math.abs(rounded).toLocaleString("ja-JP");
  return rounded < 0 ? `-¥${absolute}` : `¥${absolute}`;
}

function formatDifference(value: number) {
  if (value === 0) {
    return "±¥0";
  }

  const rounded = Math.round(value);
  const absolute = Math.abs(rounded).toLocaleString("ja-JP");
  return rounded > 0 ? `+¥${absolute}` : `-¥${absolute}`;
}

function formatPercentageChange(value: number) {
  if (value === 0) {
    return "±0.0%";
  }

  const formatted = `${Math.abs(value * 100).toFixed(1)}%`;
  return value > 0 ? `+${formatted}` : `-${formatted}`;
}
