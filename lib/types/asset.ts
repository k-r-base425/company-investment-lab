export type AssetAllocationType =
  | "cash"
  | "japanese_stock"
  | "mutual_fund"
  | "taxable_account"
  | "business_cash";

export type AssetAllocationItem = {
  id: string;
  name: string;
  type: AssetAllocationType;
  amount: number;
  ratio: number;
  colorTone: "blue" | "green" | "purple" | "orange" | "teal";
};

export type AssetAllocationSummary = {
  totalAssets: number;
  cashRatio: number;
  updatedAt: string;
  items: AssetAllocationItem[];
};
