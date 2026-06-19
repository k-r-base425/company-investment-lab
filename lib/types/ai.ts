import type { AccountingAnalysisPayload } from "../accounting/buildAccountingAnalysisPayload";

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
    unit: "day";
    notes: string;
    days: {
      date: string;
      day: number;
      value: number | null;
      status: "high" | "middle" | "low" | "empty";
    }[];
  };
  learning: {
    currentTopics: string[];
    progressRate: number;
  };
};

export type AiAnalysisDay = AiAnalysisPayload["monthlyChart"]["days"][number];
