import type { MonthlyAccountingSummary } from "../types/accounting";
import type {
  MonthlyComparisonMetric,
  MonthlyComparisonMetricKey,
  MonthlyComparisonSummary,
  MonthlyComparisonTone,
  MonthlyComparisonTrend
} from "../types/monthlyComparison";

type BuildMonthlyComparisonSummaryParams = {
  currentSummary: MonthlyAccountingSummary;
  previousSummary: MonthlyAccountingSummary | null;
  currentMonth: string;
  previousMonth: string;
};

type MetricDefinition = {
  key: MonthlyComparisonMetricKey;
  label: string;
  getValue: (summary: MonthlyAccountingSummary) => number;
};

const metricDefinitions: MetricDefinition[] = [
  { key: "revenue", label: "売上", getValue: (summary) => summary.revenueTotal },
  { key: "expense", label: "経費", getValue: (summary) => summary.expenseTotal },
  { key: "household", label: "家計支出", getValue: (summary) => summary.householdTotal },
  { key: "profit", label: "利益", getValue: (summary) => summary.profit },
  { key: "estimatedTax", label: "税金目安", getValue: (summary) => summary.estimatedTax },
  { key: "investableAmount", label: "投資可能額", getValue: (summary) => summary.investableAmount }
];

export function buildMonthlyComparisonSummary({
  currentSummary,
  previousSummary,
  currentMonth,
  previousMonth
}: BuildMonthlyComparisonSummaryParams): MonthlyComparisonSummary {
  const comparablePreviousSummary = previousSummary && previousSummary.entryCount > 0 ? previousSummary : null;

  return {
    currentMonth,
    previousMonth,
    currentEntryCount: currentSummary.entryCount,
    previousEntryCount: comparablePreviousSummary?.entryCount ?? 0,
    hasPreviousData: Boolean(comparablePreviousSummary),
    metrics: metricDefinitions.map((definition) =>
      buildMetric({
        currentValue: definition.getValue(currentSummary),
        definition,
        previousValue: comparablePreviousSummary ? definition.getValue(comparablePreviousSummary) : null
      })
    )
  };
}

export function findMonthlyComparisonMetric(
  comparison: MonthlyComparisonSummary | undefined,
  key: MonthlyComparisonMetricKey
) {
  return comparison?.metrics.find((metric) => metric.key === key);
}

function buildMetric({
  currentValue,
  definition,
  previousValue
}: {
  currentValue: number;
  definition: MetricDefinition;
  previousValue: number | null;
}): MonthlyComparisonMetric {
  if (previousValue === null) {
    return {
      key: definition.key,
      label: definition.label,
      currentValue,
      previousValue: null,
      difference: null,
      percentageChange: null,
      trend: "no_previous",
      tone: "neutral",
      displayValue: formatYen(currentValue),
      displayDifference: "前月データなし",
      displayPercentageChange: "前月データなし"
    };
  }

  const difference = currentValue - previousValue;
  const percentageChange = previousValue !== 0 ? difference / Math.abs(previousValue) : null;
  const trend = getTrend(difference);
  const tone = getTone(definition.key, trend, currentValue);

  return {
    key: definition.key,
    label: definition.label,
    currentValue,
    previousValue,
    difference,
    percentageChange,
    trend,
    tone,
    displayValue: formatYen(currentValue),
    displayDifference: formatDifference(difference),
    displayPercentageChange: percentageChange === null ? "比較不可" : formatPercentageChange(percentageChange),
    note: previousValue === 0 ? "前月が0円のため増減率は比較不可です。" : undefined
  };
}

function getTrend(difference: number): MonthlyComparisonTrend {
  if (difference > 0) {
    return "increased";
  }

  if (difference < 0) {
    return "decreased";
  }

  return "flat";
}

function getTone(
  key: MonthlyComparisonMetricKey,
  trend: MonthlyComparisonTrend,
  currentValue: number
): MonthlyComparisonTone {
  if (trend === "flat" || trend === "no_previous" || key === "estimatedTax") {
    return "neutral";
  }

  if (key === "expense" || key === "household") {
    return trend === "increased" ? "warning" : "positive";
  }

  if (key === "investableAmount" && currentValue < 0) {
    return "negative";
  }

  if (key === "profit" && currentValue < 0) {
    return "negative";
  }

  return trend === "increased" ? "positive" : "warning";
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
