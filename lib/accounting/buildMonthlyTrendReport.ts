import { calculateMonthlyAccountingSummary } from "./calculateAccountingSummary";
import { formatYearMonthLabel } from "../month/monthUtils";
import type { AccountingEntry } from "../types/accounting";
import type {
  MonthlyTrendDirection,
  MonthlyTrendMetricKey,
  MonthlyTrendMetricSummary,
  MonthlyTrendPoint,
  MonthlyTrendReport
} from "../types/monthlyTrendReport";

type BuildMonthlyTrendReportParams = {
  entriesByMonth: Record<string, AccountingEntry[]>;
  selectedMonth: string;
  months: string[];
};

type MetricDefinition = {
  key: MonthlyTrendMetricKey;
  label: string;
  getValue: (point: MonthlyTrendPoint) => number;
};

const metricDefinitions: MetricDefinition[] = [
  { key: "revenue", label: "売上", getValue: (point) => point.revenueTotal },
  { key: "expense", label: "経費", getValue: (point) => point.expenseTotal },
  { key: "household", label: "家計支出", getValue: (point) => point.householdTotal },
  { key: "profit", label: "利益", getValue: (point) => point.profit },
  { key: "estimatedTax", label: "税金目安", getValue: (point) => point.estimatedTax },
  { key: "investableAmount", label: "投資可能額", getValue: (point) => point.investableAmount }
];

export function buildMonthlyTrendReport({
  entriesByMonth,
  selectedMonth,
  months
}: BuildMonthlyTrendReportParams): MonthlyTrendReport {
  const points = months.map((month) => buildPoint(month, entriesByMonth[month] ?? []));
  const dataMonthCount = points.filter((point) => point.hasData).length;

  return {
    selectedMonth,
    selectedMonthLabel: formatYearMonthLabel(selectedMonth),
    months,
    points,
    metricSummaries: metricDefinitions.map((definition) => buildMetricSummary(definition, points, selectedMonth)),
    dataMonthCount,
    emptyMonthCount: points.length - dataMonthCount,
    generatedAt: new Date().toISOString()
  };
}

function buildPoint(month: string, entries: AccountingEntry[]): MonthlyTrendPoint {
  const summary = calculateMonthlyAccountingSummary(entries, month);

  return {
    month,
    monthLabel: formatYearMonthLabel(month),
    entryCount: summary.entryCount,
    hasData: summary.entryCount > 0,
    revenueTotal: summary.revenueTotal,
    expenseTotal: summary.expenseTotal,
    householdTotal: summary.householdTotal,
    profit: summary.profit,
    estimatedTax: summary.estimatedTax,
    investableAmount: summary.investableAmount,
    expenseRatio: summary.expenseRatio,
    profitMargin: summary.profitMargin
  };
}

function buildMetricSummary(
  definition: MetricDefinition,
  points: MonthlyTrendPoint[],
  selectedMonth: string
): MonthlyTrendMetricSummary {
  const currentPoint = points.find((point) => point.month === selectedMonth) ?? points[points.length - 1];
  const previousPoint = getPreviousDataPoint(points, selectedMonth);
  const dataPoints = points.filter((point) => point.hasData);
  const dataValues = dataPoints.map(definition.getValue);
  const currentValue = currentPoint ? definition.getValue(currentPoint) : 0;
  const totalValue = dataValues.reduce((total, value) => total + value, 0);
  const averageValue = dataValues.length > 0 ? totalValue / dataValues.length : 0;

  return {
    key: definition.key,
    label: definition.label,
    currentValue,
    previousValue: previousPoint ? definition.getValue(previousPoint) : null,
    minValue: dataValues.length > 0 ? Math.min(...dataValues) : 0,
    maxValue: dataValues.length > 0 ? Math.max(...dataValues) : 0,
    averageValue,
    totalValue,
    direction: getDirection(dataValues),
    currentDisplayValue: formatYen(currentValue),
    averageDisplayValue: formatYen(averageValue),
    note: dataValues.length < 2 ? "比較できる月がまだ少ないです。" : undefined
  };
}

function getPreviousDataPoint(points: MonthlyTrendPoint[], selectedMonth: string) {
  const selectedIndex = points.findIndex((point) => point.month === selectedMonth);

  if (selectedIndex <= 0) {
    return null;
  }

  return [...points.slice(0, selectedIndex)].reverse().find((point) => point.hasData) ?? null;
}

function getDirection(values: number[]): MonthlyTrendDirection {
  if (values.length < 2) {
    return "insufficient_data";
  }

  const first = values[0];
  const last = values[values.length - 1];

  if (last > first) {
    return "up";
  }

  if (last < first) {
    return "down";
  }

  return "flat";
}

function formatYen(value: number) {
  const rounded = Math.round(value);
  const absolute = Math.abs(rounded).toLocaleString("ja-JP");
  return rounded < 0 ? `-¥${absolute}` : `¥${absolute}`;
}
