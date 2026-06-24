import { buildInvestmentAnalysisPayload } from "../investment/buildInvestmentAnalysisPayload";
import type { InvestmentAnalysisDataSource } from "../investment/buildInvestmentAnalysisPayload";
import type { AiAnalysisRun } from "../types/aiAnalysisRun";
import type { InvestmentHolding } from "../types/investment";

type CreateInvestmentAiAnalysisRunParams = {
  dataSource: InvestmentAnalysisDataSource;
  holdings: InvestmentHolding[];
  period: string;
  promptText: string;
  source?: Extract<AiAnalysisRun["source"], "investment_export" | "investment_tab">;
  title: string;
};

export function createInvestmentAiAnalysisRun({
  dataSource,
  holdings,
  period,
  promptText,
  source = "investment_tab",
  title
}: CreateInvestmentAiAnalysisRunParams): AiAnalysisRun {
  const now = new Date().toISOString();
  const payload = buildInvestmentAnalysisPayload({
    dataSource,
    holdings,
    period,
    exportedAt: now
  });

  return {
    id: `investment-ai-analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    period,
    title,
    theme: "investment_review",
    status: "prompt_copied",
    promptText,
    payloadJson: JSON.stringify(payload, null, 2),
    source,
    createdAt: now,
    updatedAt: now
  };
}
