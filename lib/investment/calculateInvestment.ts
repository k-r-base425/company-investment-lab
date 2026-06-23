import type {
  InvestmentAllocationItem,
  InvestmentAssetType,
  InvestmentHolding,
  InvestmentHoldingCalculated,
  InvestmentHoldingMode,
  InvestmentSummary
} from "../types/investment";

export const investmentAssetTypeLabels: Record<InvestmentAssetType, string> = {
  cash: "現金",
  japanese_stock: "日本株",
  us_stock: "米国株",
  mutual_fund: "投資信託",
  etf: "ETF"
};

const assetTypeOrder: InvestmentAssetType[] = ["cash", "japanese_stock", "us_stock", "mutual_fund", "etf"];

export function calculateInvestmentHolding(holding: InvestmentHolding): InvestmentHoldingCalculated {
  const acquisitionAmount = holding.quantity * holding.averageCost;
  const marketValue = holding.quantity * holding.currentPrice;
  const gainLoss = marketValue - acquisitionAmount;
  const gainLossRate = acquisitionAmount > 0 ? gainLoss / acquisitionAmount : 0;

  return {
    ...holding,
    acquisitionAmount,
    marketValue,
    gainLoss,
    gainLossRate
  };
}

export function calculateInvestmentSummary(holdings: InvestmentHolding[]): InvestmentSummary {
  const calculated = holdings.map(calculateInvestmentHolding);
  const acquisitionTotal = calculated.reduce((sum, holding) => sum + holding.acquisitionAmount, 0);
  const marketValueTotal = calculated.reduce((sum, holding) => sum + holding.marketValue, 0);
  const gainLossTotal = marketValueTotal - acquisitionTotal;
  const gainLossRate = acquisitionTotal > 0 ? gainLossTotal / acquisitionTotal : 0;
  const cashValue = calculated
    .filter((holding) => holding.assetType === "cash")
    .reduce((sum, holding) => sum + holding.marketValue, 0);
  const cashRatio = marketValueTotal > 0 ? cashValue / marketValueTotal : 0;
  const actualMarketValue = calculated
    .filter((holding) => holding.positionType === "actual")
    .reduce((sum, holding) => sum + holding.marketValue, 0);
  const virtualMarketValue = calculated
    .filter((holding) => holding.positionType === "virtual")
    .reduce((sum, holding) => sum + holding.marketValue, 0);

  return {
    acquisitionTotal,
    marketValueTotal,
    gainLossTotal,
    gainLossRate,
    cashValue,
    cashRatio,
    actualMarketValue,
    virtualMarketValue
  };
}

export function filterInvestmentHoldingsByMode(
  holdings: InvestmentHolding[],
  mode: InvestmentHoldingMode
): InvestmentHolding[] {
  if (mode === "all") {
    return holdings;
  }

  return holdings.filter((holding) => holding.positionType === mode);
}

export function buildInvestmentAllocation(holdings: InvestmentHolding[]): InvestmentAllocationItem[] {
  const calculated = holdings.map(calculateInvestmentHolding);
  const total = calculated.reduce((sum, holding) => sum + holding.marketValue, 0);

  return assetTypeOrder.map((assetType) => {
    const amount = calculated
      .filter((holding) => holding.assetType === assetType)
      .reduce((sum, holding) => sum + holding.marketValue, 0);

    return {
      assetType,
      label: investmentAssetTypeLabels[assetType],
      amount,
      ratio: total > 0 ? amount / total : 0
    };
  });
}
