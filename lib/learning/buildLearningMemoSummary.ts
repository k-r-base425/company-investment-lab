import type { LearningMemo, LearningMemoSummary } from "../types/learningMemo";

export function buildLearningMemoSummary(memos: LearningMemo[]): LearningMemoSummary {
  const sortedMemos = [...memos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const categories = memos.reduce<Record<string, number>>((result, memo) => {
    result[memo.category] = (result[memo.category] ?? 0) + 1;
    return result;
  }, {});

  return {
    totalCount: memos.length,
    manualMemoCount: memos.filter((memo) => memo.source === "manual").length,
    aiDerivedMemoCount: memos.filter((memo) => memo.source === "ai_analysis" || memo.sourceAiAnalysisRunId).length,
    accountingMemoCount: memos.filter((memo) => memo.category === "accounting" || memo.category === "bookkeeping").length,
    investmentMemoCount: memos.filter((memo) => memo.category === "investment").length,
    aiAnalysisMemoCount: memos.filter((memo) => memo.category === "ai_analysis" || memo.source === "ai_analysis").length,
    categories: Object.entries(categories)
      .map(([category, count]) => ({ category: category as LearningMemo["category"], count }))
      .sort((a, b) => a.category.localeCompare(b.category)),
    latestMemos: sortedMemos.slice(0, 3)
  };
}
