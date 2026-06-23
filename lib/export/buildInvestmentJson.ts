import {
  buildInvestmentAnalysisPayload,
  type InvestmentAnalysisDataSource
} from "../investment/buildInvestmentAnalysisPayload";
import type { InvestmentHolding } from "../types/investment";
import type { YearMonth } from "../types/month";

type BuildInvestmentJsonParams = {
  holdings: InvestmentHolding[];
  period: YearMonth;
  dataSource: InvestmentAnalysisDataSource;
};

export function buildInvestmentJson({ dataSource, holdings, period }: BuildInvestmentJsonParams): string {
  return JSON.stringify(
    buildInvestmentAnalysisPayload({
      dataSource,
      holdings,
      period
    }),
    null,
    2
  );
}
