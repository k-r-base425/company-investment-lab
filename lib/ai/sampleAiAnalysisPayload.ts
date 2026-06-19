import type { AiAnalysisDay, AiAnalysisPayload } from "../types/ai";
import { buildAccountingAnalysisPayload } from "../accounting/buildAccountingAnalysisPayload";
import { sampleAccountingEntries } from "../accounting/sampleAccountingEntries";

const dailyValues: Array<number | null> = [
  120000,
  86000,
  148000,
  94000,
  null,
  175000,
  98000,
  132000,
  76000,
  165000,
  118000,
  null,
  91000,
  142000,
  188000,
  104000,
  72000,
  128000,
  null,
  155000,
  98000,
  136000,
  121000,
  172000,
  69000,
  null,
  149000,
  112000,
  184000,
  126000
];

function getStatus(value: number | null): AiAnalysisDay["status"] {
  if (value === null) {
    return "empty";
  }

  if (value >= 150000) {
    return "high";
  }

  if (value >= 100000) {
    return "middle";
  }

  return "low";
}

export const sampleMonthlyChartDays: AiAnalysisDay[] = dailyValues.map((value, index) => {
  const day = index + 1;
  return {
    date: `2026-06-${String(day).padStart(2, "0")}`,
    day,
    value,
    status: getStatus(value)
  };
});

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
  accountingAnalysis: buildAccountingAnalysisPayload(sampleAccountingEntries, "2026-06"),
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
    unit: "day",
    notes: "未入力日は null。status は high / middle / low / empty。",
    days: sampleMonthlyChartDays
  },
  learning: {
    currentTopics: ["PER", "PBR", "ROE", "簿記2級"],
    progressRate: 0.62
  }
};
