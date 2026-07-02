import type { LearningMemo } from "../types/learningMemo";
import type { LearningMemoSearchResult, LearningMemoSearchState } from "../types/learningMemoSearch";

export const defaultLearningMemoSearchState: LearningMemoSearchState = {
  category: "all",
  keyword: "",
  onlyAiDerived: false,
  sortKey: "newest",
  source: "all",
  topicId: "all"
};

export function searchLearningMemos({
  memos,
  state
}: {
  memos: LearningMemo[];
  state: LearningMemoSearchState;
}): LearningMemoSearchResult {
  const keyword = state.keyword.trim().toLowerCase();

  const filtered = memos.filter((memo) => {
    if (state.category !== "all" && memo.category !== state.category) {
      return false;
    }

    if (state.source !== "all" && memo.source !== state.source) {
      return false;
    }

    if (state.topicId !== "all" && memo.topicId !== state.topicId) {
      return false;
    }

    if (state.onlyAiDerived && memo.source !== "ai_analysis" && !memo.sourceAiAnalysisRunId) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    return buildSearchText(memo).includes(keyword);
  });

  return {
    filteredCount: filtered.length,
    results: sortMemos(filtered, state.sortKey),
    totalCount: memos.length
  };
}

function buildSearchText(memo: LearningMemo) {
  return [
    memo.title,
    memo.body,
    memo.topicTitle,
    memo.category,
    memo.source,
    memo.sourceAiAnalysisRunTitle,
    memo.relatedScreen
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function sortMemos(memos: LearningMemo[], sortKey: LearningMemoSearchState["sortKey"]) {
  return [...memos].sort((a, b) => {
    if (sortKey === "oldest") {
      return getSortDate(a).localeCompare(getSortDate(b));
    }

    if (sortKey === "topic") {
      return a.topicTitle.localeCompare(b.topicTitle) || b.createdAt.localeCompare(a.createdAt);
    }

    if (sortKey === "category") {
      return a.category.localeCompare(b.category) || a.topicTitle.localeCompare(b.topicTitle);
    }

    return getSortDate(b).localeCompare(getSortDate(a));
  });
}

function getSortDate(memo: LearningMemo) {
  return memo.updatedAt || memo.createdAt;
}
