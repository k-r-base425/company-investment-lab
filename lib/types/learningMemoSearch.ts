import type { LearningMemo } from "./learningMemo";

export type LearningMemoCategoryFilter =
  | "all"
  | "accounting"
  | "bookkeeping"
  | "investment"
  | "ai_analysis"
  | "business"
  | "other";

export type LearningMemoSourceFilter = "all" | "manual" | "ai_analysis" | "accounting" | "investment";

export type LearningMemoSortKey = "newest" | "oldest" | "topic" | "category";

export type LearningMemoSearchState = {
  keyword: string;
  category: LearningMemoCategoryFilter;
  source: LearningMemoSourceFilter;
  topicId: string | "all";
  onlyAiDerived: boolean;
  sortKey: LearningMemoSortKey;
};

export type LearningMemoSearchResult = {
  totalCount: number;
  filteredCount: number;
  results: LearningMemo[];
};
