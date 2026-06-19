import type { AccountingEntry } from "../types/accounting";

export const sampleAccountingEntries: AccountingEntry[] = [
  {
    id: "sample-revenue-1",
    type: "revenue",
    date: "2026-06-01",
    amount: 350000,
    category: "事業売上",
    paymentMethod: "銀行振込",
    memo: "Web制作案件",
    partnerName: "サンプル取引先"
  },
  {
    id: "sample-expense-1",
    type: "expense",
    date: "2026-06-02",
    amount: 12000,
    category: "ソフトウェア",
    paymentMethod: "クレジット",
    memo: "クラウドサービス利用料",
    costBehavior: "fixed",
    spendingJudgement: "investment"
  },
  {
    id: "sample-household-1",
    type: "household",
    date: "2026-06-03",
    amount: 4800,
    category: "食費",
    paymentMethod: "電子マネー",
    memo: "食材購入",
    costBehavior: "variable",
    spendingJudgement: "necessary"
  },
  {
    id: "sample-journal-1",
    type: "journal",
    date: "2026-06-04",
    amount: 8000,
    memo: "消耗品を現金で購入",
    debitAccount: "消耗品費",
    debitAmount: 8000,
    creditAccount: "現金",
    creditAmount: 8000
  }
];
