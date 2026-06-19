export type AccountingEntryType = "revenue" | "expense" | "household" | "journal";

export type PaymentMethod =
  | "銀行振込"
  | "現金"
  | "クレジット"
  | "電子マネー"
  | "銀行引落"
  | "その他";

export type CostBehavior = "fixed" | "variable";

export type SpendingJudgement = "necessary" | "waste" | "investment";

export type AccountingEntry = {
  id: string;
  type: AccountingEntryType;
  date: string;
  amount: number;
  category?: string;
  paymentMethod?: PaymentMethod;
  memo: string;
  partnerName?: string;
  costBehavior?: CostBehavior;
  spendingJudgement?: SpendingJudgement;
  debitAccount?: string;
  debitAmount?: number;
  creditAccount?: string;
  creditAmount?: number;
};
