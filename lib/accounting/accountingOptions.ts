import type { AccountingEntryType, CostBehavior, PaymentMethod, SpendingJudgement } from "../types/accounting";

export const accountingTypeLabels: Record<AccountingEntryType, string> = {
  revenue: "売上",
  expense: "経費",
  household: "家計",
  journal: "仕訳"
};

export const accountingTypeTones: Record<AccountingEntryType, string> = {
  revenue: "#2563EB",
  expense: "#EA580C",
  household: "#0F766E",
  journal: "#7C3AED"
};

export const revenueCategories = ["事業売上", "副業売上", "配当金", "雑収入", "その他収入"];

export const expenseCategories = [
  "通信費",
  "旅費交通費",
  "消耗品費",
  "広告宣伝費",
  "接待交際費",
  "外注費",
  "地代家賃",
  "水道光熱費",
  "新聞図書費",
  "支払手数料",
  "会議費",
  "研修費",
  "ソフトウェア",
  "租税公課",
  "減価償却費",
  "その他経費"
];

export const householdCategories = [
  "食費",
  "日用品",
  "家賃",
  "水道光熱費",
  "通信費",
  "交通費",
  "医療費",
  "教育・書籍",
  "サブスク",
  "交際費",
  "趣味",
  "美容",
  "衣服",
  "その他生活費"
];

export const revenuePaymentMethods: PaymentMethod[] = ["銀行振込", "現金", "クレジット", "その他"];

export const expensePaymentMethods: PaymentMethod[] = ["現金", "クレジット", "銀行振込", "電子マネー", "その他"];

export const householdPaymentMethods: PaymentMethod[] = ["現金", "クレジット", "銀行引落", "電子マネー", "その他"];

export const costBehaviorOptions: { label: string; value: CostBehavior }[] = [
  { label: "固定費", value: "fixed" },
  { label: "変動費", value: "variable" }
];

export const spendingJudgementOptions: { label: string; value: SpendingJudgement }[] = [
  { label: "必要支出", value: "necessary" },
  { label: "浪費", value: "waste" },
  { label: "投資", value: "investment" }
];

export const journalAccountOptions = [
  "現金",
  "普通預金",
  "売掛金",
  "買掛金",
  "売上",
  "仕入",
  "通信費",
  "旅費交通費",
  "消耗品費",
  "広告宣伝費",
  "接待交際費",
  "外注費",
  "地代家賃",
  "水道光熱費",
  "減価償却費",
  "支払手数料",
  "雑収入",
  "事業主貸",
  "事業主借",
  "資本金",
  "繰越利益剰余金"
];

export function getCategories(type: AccountingEntryType) {
  switch (type) {
    case "revenue":
      return revenueCategories;
    case "expense":
      return expenseCategories;
    case "household":
      return householdCategories;
    default:
      return [];
  }
}

export function getPaymentMethods(type: AccountingEntryType) {
  switch (type) {
    case "revenue":
      return revenuePaymentMethods;
    case "expense":
      return expensePaymentMethods;
    case "household":
      return householdPaymentMethods;
    default:
      return [];
  }
}
