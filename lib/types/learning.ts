export type LearningCategory =
  | "investment_indicator"
  | "bookkeeping"
  | "financial_statement"
  | "management";

export type LearningTopic = {
  id: string;
  title: string;
  category: LearningCategory;
  categoryLabel: string;
  estimatedMinutes: number;
  progressRate: number;
  description: string;
  reason: string;
  tone: "blue" | "green" | "purple" | "orange" | "teal" | "navy";
};
