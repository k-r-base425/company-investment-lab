import {
  buildInvestmentAllocation,
  calculateInvestmentHolding,
  calculateInvestmentSummary,
  investmentAssetTypeLabels
} from "./calculateInvestment";
import type { InvestmentAssetType, InvestmentHolding } from "../types/investment";

export type InvestmentAnalysisDataSource = "saved" | "sample";

export type InvestmentAnalysisAsset = {
  id: string;
  name: string;
  ticker?: string;
  assetType: InvestmentAssetType;
  assetTypeLabel: string;
  positionType: InvestmentHolding["positionType"];
  quantity: number;
  averageCost: number;
  currentPrice: number;
  acquisitionAmount: number;
  marketValue: number;
  gainLoss: number;
  gainLossRate: number;
  dividendYield?: number;
  per?: number;
  pbr?: number;
  roe?: number;
  memo?: string;
  ratio: number;
};

export type InvestmentAnalysisPayload = {
  period: string;
  snapshotMonth: string;
  exportedAt: string;
  dataSource: InvestmentAnalysisDataSource;
  totalAssets: number;
  acquisitionTotal: number;
  marketValueTotal: number;
  cashRatio: number;
  unrealizedGain: number;
  gainLossRate: number;
  actualMarketValue: number;
  virtualMarketValue: number;
  assets: InvestmentAnalysisAsset[];
  holdings: InvestmentAnalysisAsset[];
  allocation: {
    assetType: InvestmentAssetType;
    label: string;
    marketValue: number;
    ratio: number;
  }[];
  summary: ReturnType<typeof calculateInvestmentSummary>;
  indicatorNotes: {
    per: string;
    pbr: string;
    roe: string;
    dividendYield: string;
  };
  assumptions: string[];
  notes: string;
};

type BuildInvestmentAnalysisPayloadParams = {
  holdings: InvestmentHolding[];
  period?: string;
  dataSource?: InvestmentAnalysisDataSource;
  exportedAt?: string;
};

export function buildInvestmentAnalysisPayload(
  paramsOrHoldings: BuildInvestmentAnalysisPayloadParams | InvestmentHolding[]
): InvestmentAnalysisPayload {
  const params = Array.isArray(paramsOrHoldings) ? { holdings: paramsOrHoldings } : paramsOrHoldings;
  const { dataSource = "sample", exportedAt = new Date().toISOString(), holdings, period = "2026-06" } = params;
  const summary = calculateInvestmentSummary(holdings);
  const calculatedHoldings = holdings.map(calculateInvestmentHolding);
  const assets = calculatedHoldings.map((holding) => ({
    ...holding,
    assetTypeLabel: investmentAssetTypeLabels[holding.assetType],
    ratio: summary.marketValueTotal > 0 ? holding.marketValue / summary.marketValueTotal : 0
  }));
  const allocation = buildInvestmentAllocation(holdings).map((item) => ({
    assetType: item.assetType,
    label: item.label,
    marketValue: item.amount,
    ratio: item.ratio
  }));

  return {
    period,
    snapshotMonth: period,
    exportedAt,
    dataSource,
    totalAssets: summary.marketValueTotal,
    acquisitionTotal: summary.acquisitionTotal,
    marketValueTotal: summary.marketValueTotal,
    cashRatio: summary.cashRatio,
    unrealizedGain: summary.gainLossTotal,
    gainLossRate: summary.gainLossRate,
    actualMarketValue: summary.actualMarketValue,
    virtualMarketValue: summary.virtualMarketValue,
    assets,
    holdings: assets,
    allocation,
    summary,
    indicatorNotes: {
      per: "株価が利益の何倍まで買われているかを見る指標",
      pbr: "株価が純資産の何倍まで買われているかを見る指標",
      roe: "自己資本を使ってどれだけ利益を出しているかを見る指標",
      dividendYield: "投資額に対して年間配当がどれくらいあるかを見る指標"
    },
    assumptions: [
      "株価・指標は手入力またはサンプルです",
      "為替換算はまだ実装していません",
      "投資判断には複数の情報確認が必要です"
    ],
    notes: "株価・指標は手入力またはサンプルです。投資判断には複数の情報を確認してください。"
  };
}
