import type { AiAnalysisPayload } from "../types/ai";
import type { AiAnalysisRun, AiAnalysisTheme } from "../types/aiAnalysisRun";

type CreateAiAnalysisRunParams = {
  payload: AiAnalysisPayload;
  period: string;
  promptText: string;
  source?: AiAnalysisRun["source"];
  theme?: AiAnalysisTheme;
  title?: string;
};

export function createAiAnalysisRun({
  payload,
  period,
  promptText,
  source = "home_ai_card",
  theme = "monthly_review",
  title = "月次AI分析"
}: CreateAiAnalysisRunParams): AiAnalysisRun {
  const now = new Date().toISOString();

  return {
    id: `ai-analysis-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    period,
    title,
    theme,
    status: "prompt_copied",
    promptText,
    payloadJson: JSON.stringify(payload, null, 2),
    source,
    createdAt: now,
    updatedAt: now
  };
}
