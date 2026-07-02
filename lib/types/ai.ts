import type { AccountingAnalysisPayload } from "../accounting/buildAccountingAnalysisPayload";
import type { AiAnalysisRunsSummary } from "../ai/buildAiAnalysisRunsSummary";
import type { ImprovementActionsSummary } from "../accounting/buildImprovementActionsSummary";
import type { InvestmentAnalysisPayload } from "../investment/buildInvestmentAnalysisPayload";
import type { AccountingInsight } from "./accountingInsight";
import type { CategoryMonthlyComparisonSummary } from "./categoryMonthlyComparison";
import type { ImprovementProgressReport } from "./improvementProgress";
import type { LearningMemoSummary } from "./learningMemo";
import type { MonthlyComparisonSummary } from "./monthlyComparison";
import type { MonthlyChartDay, MonthlyChartMetric } from "./monthlyChart";
import type { MonthlyTrendReport } from "./monthlyTrendReport";

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
  categoryMonthlyComparison?: CategoryMonthlyComparisonSummary;
  monthlyComparison?: MonthlyComparisonSummary;
  improvementActions: ImprovementActionsSummary;
  improvementProgress: ImprovementProgressReport;
  monthlyTrendReport?: MonthlyTrendReport;
  investment: InvestmentAnalysisPayload;
  aiAnalysisRunsSummary: AiAnalysisRunsSummary;
  learningMemos: LearningMemoSummary;
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
