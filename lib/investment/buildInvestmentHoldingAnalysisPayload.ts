import {
  calculateInvestmentHolding,
  calculateInvestmentSummary,
  investmentAssetTypeLabels
} from "./calculateInvestment";
import { buildInvestmentIndicatorReport } from "./buildInvestmentIndicatorReport";
import type { InvestmentHoldingCalculated } from "../types/investment";
import type { InvestmentIndicatorInsight } from "../types/investmentIndicator";
import type { InvestmentHolding } from "../types/investment";

export type InvestmentHoldingAnalysisPayload = {
  period: string;
  selectedMonthLabel: string;
  analysisType: "investment_holding_review";
  holding: InvestmentHoldingCalculated & {
    assetTypeLabel: string;
    positionTypeLabel: string;
  };
  portfolioContext: {
    marketValueTotal: number;
    cashRatio: number;
    holdingRatio: number;
    actualMarketValue: number;
    virtualMarketValue: number;
  };
  indicatorInsights: InvestmentIndicatorInsight[];
  cashReviewPoints?: string[];
  assumptions: string[];
};

type BuildInvestmentHoldingAnalysisPayloadParams = {
  allHoldings: InvestmentHolding[];
  holding: InvestmentHolding;
  period: string;
  selectedMonthLabel: string;
};

export function buildInvestmentHoldingAnalysisPayload({
  allHoldings,
  holding,
  period,
  selectedMonthLabel
}: BuildInvestmentHoldingAnalysisPayloadParams): InvestmentHoldingAnalysisPayload {
  const calculatedHolding = calculateInvestmentHolding(holding);
  const summary = calculateInvestmentSummary(allHoldings);
  const indicatorReport = buildInvestmentIndicatorReport(allHoldings);
  const indicatorInsights = indicatorReport.insights.filter((insight) => insight.holdingId === holding.id);

  return {
    period,
    selectedMonthLabel,
    analysisType: "investment_holding_review",
    holding: {
      ...calculatedHolding,
      assetTypeLabel: investmentAssetTypeLabels[holding.assetType],
      positionTypeLabel: holding.positionType === "virtual" ? "仮想保有" : "実保有"
    },
    portfolioContext: {
      marketValueTotal: summary.marketValueTotal,
      cashRatio: summary.cashRatio,
      holdingRatio: summary.marketValueTotal > 0 ? calculatedHolding.marketValue / summary.marketValueTotal : 0,
      actualMarketValue: summary.actualMarketValue,
      virtualMarketValue: summary.virtualMarketValue
    },
    indicatorInsights,
    cashReviewPoints:
      holding.assetType === "cash"
        ? [
            "現金比率が生活防衛資金や投資待機資金として十分か確認する",
            "投資余力と安全資金のバランスを確認する",
            "追加投資を急がず、目的別の現金配分を確認する"
          ]
        : undefined,
    assumptions: [
      "株価・指標は手入力またはサンプルです",
      "為替換算はまだ実装していません",
      "この分析は学習・検討用であり、投資判断を断定するものではありません"
    ]
  };
}
