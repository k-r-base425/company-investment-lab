export type InvestmentIndicatorKey = "per" | "pbr" | "roe" | "dividendYield";

export type InvestmentIndicatorTone = "good" | "notice" | "warning" | "unknown";

export type InvestmentIndicatorInsight = {
  id: string;
  holdingId: string;
  holdingName: string;
  ticker?: string;
  indicatorKey: InvestmentIndicatorKey;
  label: string;
  value: number | null;
  displayValue: string;
  tone: InvestmentIndicatorTone;
  title: string;
  message: string;
  learningPoint: string;
  checkPoints: string[];
};

export type InvestmentIndicatorLearningTopic = {
  key: InvestmentIndicatorKey;
  label: string;
  shortDescription: string;
  formulaLabel: string;
  howToRead: string;
  caution: string;
  example?: string;
};

export type InvestmentIndicatorReport = {
  generatedAt: string;
  holdingCount: number;
  insights: InvestmentIndicatorInsight[];
  topics: InvestmentIndicatorLearningTopic[];
};
