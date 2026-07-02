import type { LearningMemo, LearningMemoSummary } from "../types/learningMemo";

export function buildLearningMemoSummary(memos: LearningMemo[]): LearningMemoSummary {
  const sortedMemos = [...memos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    totalCount: memos.length,
    accountingMemoCount: memos.filter((memo) => memo.category === "accounting" || memo.category === "bookkeeping").length,
    investmentMemoCount: memos.filter((memo) => memo.category === "investment").length,
    aiAnalysisMemoCount: memos.filter((memo) => memo.category === "ai_analysis" || memo.source === "ai_analysis").length,
    latestMemos: sortedMemos.slice(0, 3)
  };
}
