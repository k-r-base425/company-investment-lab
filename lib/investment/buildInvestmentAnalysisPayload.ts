import {
  buildInvestmentAllocation,
  calculateInvestmentHolding,
  calculateInvestmentSummary,
  investmentAssetTypeLabels
} from "./calculateInvestment";
import type { InvestmentAssetType, InvestmentHolding } from "../types/investment";

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
  notes: string;
};

export function buildInvestmentAnalysisPayload(holdings: InvestmentHolding[]): InvestmentAnalysisPayload {
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
    notes: "株価・指標は手入力またはサンプルです。投資判断には複数の情報を確認してください。"
  };
}
