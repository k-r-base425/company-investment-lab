import type { AssetAllocationSummary } from "../types/asset";

export const sampleAssetAllocation: AssetAllocationSummary = {
  totalAssets: 14850000,
  cashRatio: 28.6,
  updatedAt: "2026/06/01 08:30",
  items: [
    {
      id: "cash",
      name: "現金",
      type: "cash",
      amount: 4250000,
      ratio: 28.6,
      colorTone: "blue"
    },
    {
      id: "japanese-stock",
      name: "日本株",
      type: "japanese_stock",
      amount: 3610000,
      ratio: 24.3,
      colorTone: "green"
    },
    {
      id: "mutual-fund",
      name: "投資信託",
      type: "mutual_fund",
      amount: 3090000,
      ratio: 20.8,
      colorTone: "purple"
    },
    {
      id: "taxable-account",
      name: "特定口座",
      type: "taxable_account",
      amount: 2180000,
      ratio: 14.7,
      colorTone: "orange"
    },
    {
      id: "business-cash",
      name: "事業資金",
      type: "business_cash",
      amount: 1720000,
      ratio: 11.6,
      colorTone: "teal"
    }
  ]
};
