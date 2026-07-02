export type LearningMemoSource = "manual" | "ai_analysis" | "accounting" | "investment";

export type LearningMemoCategory =
  | "accounting"
  | "bookkeeping"
  | "investment"
  | "ai_analysis"
  | "business"
  | "other";

export type LearningMemo = {
  id: string;
  topicId: string;
  topicTitle: string;
  category: LearningMemoCategory;
  title: string;
  body: string;
  source: LearningMemoSource;
  sourceAiAnalysisRunId?: string;
  sourceAiAnalysisRunTitle?: string;
  relatedScreen?: string;
  createdAt: string;
  updatedAt: string;
};

export type LearningMemoSummary = {
  totalCount: number;
  manualMemoCount: number;
  aiDerivedMemoCount: number;
  accountingMemoCount: number;
  investmentMemoCount: number;
  aiAnalysisMemoCount: number;
  categories: {
    category: LearningMemoCategory;
    count: number;
  }[];
  latestMemos: LearningMemo[];
};
