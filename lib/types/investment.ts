export type InvestmentAssetType = "cash" | "japanese_stock" | "us_stock" | "mutual_fund" | "etf";

export type InvestmentPositionType = "actual" | "virtual";

export type InvestmentHoldingMode = "actual" | "virtual" | "all";

export type InvestmentHolding = {
  id: string;
  name: string;
  ticker?: string;
  assetType: InvestmentAssetType;
  positionType: InvestmentPositionType;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  dividendYield?: number;
  per?: number;
  pbr?: number;
  roe?: number;
  memo?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type InvestmentHoldingCalculated = InvestmentHolding & {
  acquisitionAmount: number;
  marketValue: number;
  gainLoss: number;
  gainLossRate: number;
};

export type InvestmentSummary = {
  acquisitionTotal: number;
  marketValueTotal: number;
  gainLossTotal: number;
  gainLossRate: number;
  cashValue: number;
  cashRatio: number;
  actualMarketValue: number;
  virtualMarketValue: number;
};

export type InvestmentAllocationItem = {
  assetType: InvestmentAssetType;
  label: string;
  amount: number;
  ratio: number;
};
