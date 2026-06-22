import type { YearMonth } from "../types/month";

export function buildAccountingEntriesCsvFileName(month: YearMonth) {
  return `accounting_entries_${month}.csv`;
}

export function buildAccountingAnalysisJsonFileName(month: YearMonth) {
  return `accounting_analysis_${month}.json`;
}

export function buildAiAnalysisPromptTextFileName(month: YearMonth) {
  return `ai_analysis_prompt_${month}.txt`;
}
