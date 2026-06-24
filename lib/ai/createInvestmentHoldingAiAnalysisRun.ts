import type { InvestmentHoldingAnalysisPayload } from "../investment/buildInvestmentHoldingAnalysisPayload";
import type { AiAnalysisRun } from "../types/aiAnalysisRun";

type CreateInvestmentHoldingAiAnalysisRunParams = {
  payload: InvestmentHoldingAnalysisPayload;
  promptText: string;
};

export function createInvestmentHoldingAiAnalysisRun({
  payload,
  promptText
}: CreateInvestmentHoldingAiAnalysisRunParams): AiAnalysisRun {
  const now = new Date().toISOString();

  return {
    id: `investment-holding-ai-analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    period: payload.period,
    title: `${payload.holding.name} 銘柄AI分析`,
    theme: "investment_holding_review",
    status: "prompt_copied",
    promptText,
    payloadJson: JSON.stringify(payload, null, 2),
    source: "investment_holding_card",
    createdAt: now,
    updatedAt: now
  };
}
