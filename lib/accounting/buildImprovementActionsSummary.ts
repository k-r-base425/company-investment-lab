import type { ImprovementAction, ImprovementActionPriority, ImprovementActionStatus } from "../types/improvementAction";

export type ImprovementActionSummaryItem = {
  id: string;
  title: string;
  status: ImprovementActionStatus;
  priority: ImprovementActionPriority;
  category: string;
  source: string;
  sourceInsightTitle?: string;
  createdAt: string;
  completedAt?: string;
};

export type ImprovementActionsSummary = {
  period: string;
  totalCount: number;
  todoCount: number;
  doneCount: number;
  completionRate: number;
  actions: ImprovementActionSummaryItem[];
};

export function buildImprovementActionsSummary(actions: ImprovementAction[], period: string): ImprovementActionsSummary {
  const periodActions = sortImprovementActions(actions.filter((action) => action.period === period));
  const doneCount = periodActions.filter((action) => action.status === "done").length;
  const todoCount = periodActions.filter((action) => action.status !== "done").length;
  const totalCount = periodActions.length;

  return {
    period,
    totalCount,
    todoCount,
    doneCount,
    completionRate: totalCount > 0 ? doneCount / totalCount : 0,
    actions: periodActions.map((action) => ({
      id: action.id,
      title: action.title,
      status: action.status,
      priority: action.priority,
      category: action.category,
      source: action.source,
      sourceInsightTitle: action.sourceInsightTitle,
      createdAt: action.createdAt,
      completedAt: action.completedAt
    }))
  };
}

export function getTopTodoImprovementActions(actions: ImprovementAction[], period: string, limit = 3) {
  return sortImprovementActions(actions.filter((action) => action.period === period && action.status === "todo")).slice(0, limit);
}

export function sortImprovementActions(actions: ImprovementAction[]) {
  return [...actions].sort((first, second) => {
    const statusDiff = getStatusRank(first.status) - getStatusRank(second.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    const priorityDiff = getPriorityRank(first.priority) - getPriorityRank(second.priority);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
  });
}

function getStatusRank(status: ImprovementActionStatus) {
  if (status === "todo") {
    return 0;
  }

  if (status === "deferred") {
    return 1;
  }

  return 2;
}

function getPriorityRank(priority: ImprovementActionPriority) {
  if (priority === "high") {
    return 0;
  }

  if (priority === "medium") {
    return 1;
  }

  return 2;
}
