import type { AiAnalysisRun } from "../types/aiAnalysisRun";

export type AiAnalysisRunsSummary = {
  totalCount: number;
  accountingCount: number;
  investmentCount: number;
  responseSavedCount: number;
  responsePendingCount: number;
  latestInvestmentRunTitle?: string;
  latestInvestmentRunAt?: string;
};

export function buildAiAnalysisRunsSummary(runs: AiAnalysisRun[]): AiAnalysisRunsSummary {
  const accountingRuns = runs.filter((run) => isAccountingRun(run));
  const investmentRuns = runs.filter((run) => isInvestmentRun(run));
  const responseSavedCount = runs.filter((run) => run.status === "response_saved" || Boolean(run.responseText)).length;
  const latestInvestmentRun = [...investmentRuns].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return {
    totalCount: runs.length,
    accountingCount: accountingRuns.length,
    investmentCount: investmentRuns.length,
    responseSavedCount,
    responsePendingCount: Math.max(runs.length - responseSavedCount, 0),
    latestInvestmentRunTitle: latestInvestmentRun?.title,
    latestInvestmentRunAt: latestInvestmentRun?.createdAt
  };
}

function isInvestmentRun(run: AiAnalysisRun) {
  return (
    run.theme === "investment_review" ||
    run.theme === "investment_holding_review" ||
    run.source === "investment_export" ||
    run.source === "investment_tab" ||
    run.source === "investment_holding_card"
  );
}

function isAccountingRun(run: AiAnalysisRun) {
  return !isInvestmentRun(run);
}
