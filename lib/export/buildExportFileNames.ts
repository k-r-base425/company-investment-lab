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

export function buildInvestmentHoldingsCsvFileName(month: YearMonth) {
  return `investment_holdings_${month}.csv`;
}

export function buildInvestmentAnalysisJsonFileName(month: YearMonth) {
  return `investment_analysis_${month}.json`;
}

export function buildInvestmentAiPromptTextFileName(month: YearMonth) {
  return `investment_ai_prompt_${month}.txt`;
}
