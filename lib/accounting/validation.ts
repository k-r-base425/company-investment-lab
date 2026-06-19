import type { AccountingEntryType, PaymentMethod } from "../types/accounting";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export type AccountingEntryInput = {
  type: Exclude<AccountingEntryType, "journal">;
  date: string;
  amount: string;
  category: string;
  paymentMethod: PaymentMethod | "";
  memo: string;
};

export type JournalEntryInput = {
  date: string;
  debitAccount: string;
  debitAmount: string;
  creditAccount: string;
  creditAmount: string;
  memo: string;
};

export function parseAmount(value: string) {
  return Number(value.replace(/,/g, ""));
}

export function validateAccountingEntryInput(input: AccountingEntryInput): string[] {
  const errors: string[] = [];
  const amount = parseAmount(input.amount);

  if (!input.date.trim()) {
    errors.push("日付を入力してください。");
  } else if (!datePattern.test(input.date.trim())) {
    errors.push("日付は yyyy-mm-dd 形式で入力してください。");
  }

  if (!input.amount.trim()) {
    errors.push("金額を入力してください。");
  } else if (!Number.isFinite(amount)) {
    errors.push("金額は数値で入力してください。");
  } else if (amount <= 0) {
    errors.push("金額は1以上の数値で入力してください。");
  }

  if (!input.category.trim()) {
    errors.push("カテゴリを選択してください。");
  }

  if (!input.paymentMethod) {
    errors.push("支払方法を選択してください。");
  }

  if (!input.memo.trim()) {
    errors.push("メモを入力してください。");
  }

  return errors;
}

export function validateJournalEntryInput(input: JournalEntryInput): string[] {
  const errors: string[] = [];
  const debitAmount = parseAmount(input.debitAmount);
  const creditAmount = parseAmount(input.creditAmount);

  if (!input.date.trim()) {
    errors.push("日付を入力してください。");
  } else if (!datePattern.test(input.date.trim())) {
    errors.push("日付は yyyy-mm-dd 形式で入力してください。");
  }

  if (!input.debitAccount.trim()) {
    errors.push("借方勘定科目を選択してください。");
  }

  if (!input.creditAccount.trim()) {
    errors.push("貸方勘定科目を選択してください。");
  }

  if (!input.debitAmount.trim()) {
    errors.push("借方金額を入力してください。");
  } else if (!Number.isFinite(debitAmount)) {
    errors.push("借方金額は数値で入力してください。");
  } else if (debitAmount <= 0) {
    errors.push("借方金額は1以上の数値で入力してください。");
  }

  if (!input.creditAmount.trim()) {
    errors.push("貸方金額を入力してください。");
  } else if (!Number.isFinite(creditAmount)) {
    errors.push("貸方金額は数値で入力してください。");
  } else if (creditAmount <= 0) {
    errors.push("貸方金額は1以上の数値で入力してください。");
  }

  if (Number.isFinite(debitAmount) && Number.isFinite(creditAmount) && debitAmount > 0 && creditAmount > 0 && debitAmount !== creditAmount) {
    errors.push("借方・貸方の金額が一致していません。");
  }

  if (!input.memo.trim()) {
    errors.push("摘要メモを入力してください。");
  }

  return errors;
}
