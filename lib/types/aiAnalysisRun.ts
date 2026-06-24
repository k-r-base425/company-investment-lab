export type AiAnalysisRunStatus = "prompt_created" | "prompt_copied" | "response_saved";

export type AiAnalysisTheme =
  | "monthly_review"
  | "business_profitability"
  | "household_review"
  | "investment_review"
  | "investment_holding_review"
  | "learning_review"
  | "custom";

export type AiAnalysisRun = {
  id: string;
  period: string;
  title: string;
  theme: AiAnalysisTheme;
  status: AiAnalysisRunStatus;
  promptText: string;
  payloadJson: string;
  responseText?: string;
  memo?: string;
  nextAction?: string;
  source:
    | "home_ai_card"
    | "accounting_export"
    | "investment_export"
    | "investment_tab"
    | "investment_holding_card"
    | "manual";
  createdAt: string;
  updatedAt: string;
};

export type UpdateAiAnalysisRunResponseParams = {
  id: string;
  responseText: string;
  memo?: string;
  nextAction?: string;
};
