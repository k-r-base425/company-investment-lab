import { buildAccountingAnalysisPayload } from "../accounting/buildAccountingAnalysisPayload";
import { buildImprovementActionsSummary } from "../accounting/buildImprovementActionsSummary";
import { buildMonthlyTrendReport } from "../accounting/buildMonthlyTrendReport";
import { buildMonthlyChartFromAccountingEntries } from "../home/buildMonthlyChartFromAccountingEntries";
import { buildImprovementProgressReport } from "../improvement/buildImprovementProgressReport";
import { sampleAccountingEntries } from "../accounting/sampleAccountingEntries";
import type { AiAnalysisPayload } from "../types/ai";

const sampleMonthlyChartData = buildMonthlyChartFromAccountingEntries({
  entries: sampleAccountingEntries,
  metric: "profit",
  month: "2026-06"
});
const sampleAccountingAnalysis = buildAccountingAnalysisPayload(sampleAccountingEntries, "2026-06");
const sampleImprovementActions = buildImprovementActionsSummary([], "2026-06");
const sampleImprovementProgress = buildImprovementProgressReport({
  actions: [],
  entries: sampleAccountingEntries,
  period: "2026-06"
});
const sampleMonthlyTrendReport = buildMonthlyTrendReport({
  entriesByMonth: { "2026-06": sampleAccountingEntries },
  months: ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"],
  selectedMonth: "2026-06"
});

export const sampleMonthlyChartDays = sampleMonthlyChartData.days;

export const sampleAiAnalysisPayload: AiAnalysisPayload = {
  period: "2026-06",
  goal: "数字を見て投資・経営判断ができる力を鍛える",
  business: {
    revenue: 2450000,
    expenses: 1320000,
    profit: 1130000,
    estimatedTax: 282500,
    investableAmount: 680000,
    expenseRatio: 0.539,
    profitMargin: 0.461
  },
  household: {
    totalSpending: 320000,
    fixedCost: 180000,
    variableCost: 140000,
    categories: [
      { name: "食費", amount: 65000 },
      { name: "家賃", amount: 95000 },
      { name: "通信費", amount: 12000 },
      { name: "書籍・学習", amount: 18000 },
      { name: "交際費", amount: 30000 }
    ]
  },
  accountingAnalysis: sampleAccountingAnalysis,
  accountingInsights: sampleAccountingAnalysis.accountingInsights,
  improvementActions: sampleImprovementActions,
  improvementProgress: sampleImprovementProgress,
  monthlyTrendReport: sampleMonthlyTrendReport,
  investment: {
    totalAssets: 14850000,
    cashRatio: 0.286,
    unrealizedGain: 1250000,
    assets: [
      {
        name: "現金",
        assetType: "cash",
        marketValue: 4250000,
        ratio: 0.286
      },
      {
        name: "日本株",
        assetType: "japanese_stock",
        marketValue: 3610000,
        ratio: 0.243
      },
      {
        name: "投資信託",
        assetType: "mutual_fund",
        marketValue: 3090000,
        ratio: 0.208
      },
      {
        name: "特定口座",
        assetType: "taxable_account",
        marketValue: 2180000,
        ratio: 0.147
      },
      {
        name: "事業資金",
        assetType: "business_cash",
        marketValue: 1720000,
        ratio: 0.116
      }
    ]
  },
  monthlyChart: {
    month: "2026-06",
    metric: "profit",
    unit: "day",
    notes: "保存済み会計入力データから生成。未入力日は null。status は high / middle / low / empty。",
    days: sampleMonthlyChartDays
  },
  learning: {
    currentTopics: ["PER", "PBR", "ROE", "簿記2級"],
    progressRate: 0.62
  }
};
