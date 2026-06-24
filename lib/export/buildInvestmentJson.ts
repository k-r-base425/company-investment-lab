import {
  buildInvestmentAnalysisPayload,
  type InvestmentAnalysisDataSource
} from "../investment/buildInvestmentAnalysisPayload";
import type { AiAnalysisRunsSummary } from "../ai/buildAiAnalysisRunsSummary";
import type { InvestmentHolding } from "../types/investment";
import type { YearMonth } from "../types/month";

type BuildInvestmentJsonParams = {
  holdings: InvestmentHolding[];
  period: YearMonth;
  dataSource: InvestmentAnalysisDataSource;
  aiAnalysisRunsSummary?: AiAnalysisRunsSummary;
};

export function buildInvestmentJson({
  aiAnalysisRunsSummary,
  dataSource,
  holdings,
  period
}: BuildInvestmentJsonParams): string {
  return JSON.stringify(
    buildInvestmentAnalysisPayload({
      aiAnalysisRunsSummary,
      dataSource,
      holdings,
      period
    }),
    null,
    2
  );
}
