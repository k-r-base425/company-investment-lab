import { calculateInvestmentSummary } from "../investment/calculateInvestment";
import type { HomeKpi } from "../types/home";
import type { InvestmentHolding } from "../types/investment";

type BuildHomeKpisFromInvestmentParams = {
  holdings: InvestmentHolding[];
  isFallback: boolean;
};

export function buildHomeKpisFromInvestment({
  holdings,
  isFallback
}: BuildHomeKpisFromInvestmentParams): HomeKpi[] {
  const summary = calculateInvestmentSummary(holdings);
  const gainIsPositive = summary.gainLossTotal >= 0;
  const dataLabel = isFallback ? "サンプル投資データ" : "投資データ反映";

  return [
    {
      id: "total-assets",
      title: "総資産",
      value: formatYen(summary.marketValueTotal),
      subtitle: dataLabel,
      icon: "ASSET",
      tone: "blue",
      trends: [{ label: "保存銘柄", value: `${holdings.length}件`, tone: "neutral" }]
    },
    {
      id: "cash-ratio",
      title: "現金比率",
      value: formatPercent(summary.cashRatio),
      subtitle: "現金 / 総評価額",
      icon: "CASH",
      tone: "teal",
      trends: [{ label: "現金", value: formatYen(summary.cashValue), tone: "neutral" }]
    },
    {
      id: "investment-gain",
      title: "投資損益",
      value: formatSignedYen(summary.gainLossTotal),
      subtitle: `評価損益率 ${formatSignedPercent(summary.gainLossRate)}`,
      icon: "INV",
      tone: gainIsPositive ? "green" : "orange",
      trends: [{ label: "評価", value: gainIsPositive ? "含み益" : "含み損", tone: gainIsPositive ? "positive" : "warning" }]
    }
  ];
}

function formatYen(value: number) {
  const absoluteValue = Math.abs(Math.round(value));
  const prefix = value < 0 ? "-¥" : "¥";
  return `${prefix}${absoluteValue.toLocaleString("ja-JP")}`;
}

function formatSignedYen(value: number) {
  return value > 0 ? `+${formatYen(value)}` : formatYen(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatSignedPercent(value: number) {
  if (value === 0) {
    return formatPercent(value);
  }

  return value > 0 ? `+${formatPercent(value)}` : formatPercent(value);
}
