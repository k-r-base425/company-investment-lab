import { calculateMonthlyAccountingSummary } from "../accounting/calculateAccountingSummary";
import { sampleHomeKpis } from "./sampleHomeSummary";
import type { AccountingEntry } from "../types/accounting";
import type { HomeKpi } from "../types/home";

type BuildHomeKpisFromAccountingParams = {
  entries: AccountingEntry[];
  month: string;
};

export function buildHomeKpisFromAccounting({ entries, month }: BuildHomeKpisFromAccountingParams): HomeKpi[] {
  const summary = calculateMonthlyAccountingSummary(entries, month);
  const monthlyEntries = entries.filter((entry) => entry.date.startsWith(month));
  const revenueCount = countByType(monthlyEntries, "revenue");
  const householdCount = countByType(monthlyEntries, "household");
  const profitIsPositive = summary.profit >= 0;
  const investableIsPositive = summary.investableAmount >= 0;

  return [
    {
      id: "revenue",
      title: "売上",
      value: formatYen(summary.revenueTotal),
      subtitle: "保存データ反映",
      icon: "REV",
      tone: "blue",
      trends: [{ label: "今月", value: `${revenueCount}件`, tone: "neutral" }]
    },
    {
      id: "expenses",
      title: "経費",
      value: formatYen(summary.expenseTotal),
      subtitle: `経費率 ${formatPercent(summary.expenseRatio)}`,
      icon: "COST",
      tone: "red",
      trends: [{ label: "注意", value: "増加は要確認", tone: "warning" }]
    },
    {
      id: "profit",
      title: "利益",
      value: formatYen(summary.profit),
      subtitle: `利益率 ${formatPercent(summary.profitMargin)}`,
      icon: "GAIN",
      tone: profitIsPositive ? "green" : "red",
      emphasis: true,
      trends: [{ label: "状態", value: profitIsPositive ? "黒字" : "赤字", tone: profitIsPositive ? "positive" : "negative" }]
    },
    {
      id: "estimated-tax",
      title: "税金目安",
      value: formatYen(summary.estimatedTax),
      subtitle: "概算税率 25%",
      icon: "TAX",
      tone: "purple",
      trends: [{ label: "計算", value: "概算", tone: "neutral" }]
    },
    {
      id: "investable-amount",
      title: "投資可能額",
      value: formatYen(summary.investableAmount),
      subtitle: "利益 - 税金 - 生活費 - 事業予備費",
      icon: "PLAN",
      tone: investableIsPositive ? "teal" : "orange",
      trends: [
        {
          label: "状態",
          value: investableIsPositive ? "余力あり" : "要調整",
          tone: investableIsPositive ? "positive" : "warning"
        }
      ]
    },
    {
      id: "household-spending",
      title: "家計支出",
      value: formatYen(summary.householdTotal),
      subtitle: "生活費入力分",
      icon: "LIFE",
      tone: "orange",
      trends: [{ label: "今月", value: `${householdCount}件`, tone: "neutral" }]
    },
    ...getSampleKpis(["total-assets", "cash-ratio", "investment-gain", "learning-progress"])
  ];
}

function getSampleKpis(ids: string[]) {
  return ids
    .map((id) => sampleHomeKpis.find((kpi) => kpi.id === id))
    .filter((kpi): kpi is HomeKpi => Boolean(kpi))
    .map((kpi) => ({
      ...kpi,
      subtitle: kpi.id === "learning-progress" ? "サンプル / Lv.4" : "投資データ未連動",
      trends: kpi.trends?.map((trend) => ({ ...trend, label: trend.label === "前月比" ? "サンプル" : trend.label }))
    }));
}

function countByType(entries: AccountingEntry[], type: AccountingEntry["type"]) {
  return entries.filter((entry) => entry.type === type).length;
}

function formatYen(value: number) {
  const absoluteValue = Math.abs(Math.round(value));
  const prefix = value < 0 ? "-¥" : "¥";
  return `${prefix}${absoluteValue.toLocaleString("ja-JP")}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
