import type { AccountingAnalysisPayload } from "../accounting/buildAccountingAnalysisPayload";
import type { ImprovementActionsSummary } from "../accounting/buildImprovementActionsSummary";
import type { AccountingInsight } from "./accountingInsight";
import type { MonthlyChartDay, MonthlyChartMetric } from "./monthlyChart";

export type AiAnalysisPayload = {
  period: string;
  goal: string;
  business: {
    revenue: number;
    expenses: number;
    profit: number;
    estimatedTax: number;
    investableAmount: number;
    expenseRatio: number;
    profitMargin: number;
  };
  household: {
    totalSpending: number;
    fixedCost: number;
    variableCost: number;
    categories: {
      name: string;
      amount: number;
    }[];
  };
  accountingAnalysis: AccountingAnalysisPayload;
  accountingInsights: AccountingInsight[];
  improvementActions: ImprovementActionsSummary;
  investment: {
    totalAssets: number;
    cashRatio: number;
    unrealizedGain: number;
    assets: {
      name: string;
      assetType: string;
      marketValue: number;
      ratio: number;
    }[];
  };
  monthlyChart: {
    month: string;
    metric: MonthlyChartMetric;
    unit: "day";
    notes: string;
    days: MonthlyChartDay[];
  };
  learning: {
    currentTopics: string[];
    progressRate: number;
  };
};

export type AiAnalysisDay = AiAnalysisPayload["monthlyChart"]["days"][number];
