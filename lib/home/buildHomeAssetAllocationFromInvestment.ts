import { buildInvestmentAllocation, calculateInvestmentSummary } from "../investment/calculateInvestment";
import type { AssetAllocationItem, AssetAllocationSummary } from "../types/asset";
import type { InvestmentAssetType, InvestmentHolding } from "../types/investment";

const colorToneByAssetType: Record<InvestmentAssetType, AssetAllocationItem["colorTone"]> = {
  cash: "blue",
  japanese_stock: "green",
  us_stock: "purple",
  mutual_fund: "orange",
  etf: "teal"
};

export function buildHomeAssetAllocationFromInvestment(
  holdings: InvestmentHolding[],
  dataStatusLabel: string
): AssetAllocationSummary {
  const summary = calculateInvestmentSummary(holdings);
  const items = buildInvestmentAllocation(holdings).map((item) => ({
    id: item.assetType,
    name: item.label,
    type: item.assetType,
    amount: item.amount,
    ratio: item.ratio * 100,
    colorTone: colorToneByAssetType[item.assetType]
  }));

  return {
    totalAssets: summary.marketValueTotal,
    cashRatio: summary.cashRatio * 100,
    updatedAt: dataStatusLabel,
    items
  };
}
