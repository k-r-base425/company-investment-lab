import { initAccountingDatabase, getAccountingDatabase } from "../db/accountingDatabase.native";
import type { AccountingEntry, AccountingEntryType, CostBehavior, PaymentMethod, SpendingJudgement } from "../types/accounting";

type AccountingEntryRow = {
  id: string;
  type: AccountingEntryType;
  date: string;
  amount: number;
  category: string | null;
  payment_method: PaymentMethod | null;
  memo: string;
  partner_name: string | null;
  cost_behavior: CostBehavior | null;
  spending_judgement: SpendingJudgement | null;
  debit_account: string | null;
  debit_amount: number | null;
  credit_account: string | null;
  credit_amount: number | null;
  created_at: string;
  updated_at: string;
};

export async function initAccountingStorage(): Promise<void> {
  await initAccountingDatabase();
}

export async function getAccountingEntries(): Promise<AccountingEntry[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<AccountingEntryRow>(
    `SELECT * FROM accounting_entries ORDER BY date DESC, created_at DESC`
  );
  return rows.map(mapRowToEntry);
}

export async function getAccountingEntriesByMonth(month: string): Promise<AccountingEntry[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<AccountingEntryRow>(
    `SELECT * FROM accounting_entries WHERE date LIKE ? ORDER BY date DESC, created_at DESC`,
    `${month}%`
  );
  return rows.map(mapRowToEntry);
}

export async function insertAccountingEntry(entry: AccountingEntry): Promise<void> {
  const database = await getAccountingDatabase();
  const now = new Date().toISOString();
  const createdAt = entry.createdAt ?? now;
  const updatedAt = now;

  await database.runAsync(
    `INSERT OR REPLACE INTO accounting_entries (
      id,
      type,
      date,
      amount,
      category,
      payment_method,
      memo,
      partner_name,
      cost_behavior,
      spending_judgement,
      debit_account,
      debit_amount,
      credit_account,
      credit_amount,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    entry.id,
    entry.type,
    entry.date,
    entry.amount,
    entry.category ?? null,
    entry.paymentMethod ?? null,
    entry.memo,
    entry.partnerName ?? null,
    entry.costBehavior ?? null,
    entry.spendingJudgement ?? null,
    entry.debitAccount ?? null,
    entry.debitAmount ?? null,
    entry.creditAccount ?? null,
    entry.creditAmount ?? null,
    createdAt,
    updatedAt
  );
}

export async function updateAccountingEntry(entry: AccountingEntry): Promise<void> {
  const database = await getAccountingDatabase();
  const updatedAt = new Date().toISOString();

  const result = await database.runAsync(
    `UPDATE accounting_entries
    SET
      type = ?,
      date = ?,
      amount = ?,
      category = ?,
      payment_method = ?,
      memo = ?,
      partner_name = ?,
      cost_behavior = ?,
      spending_judgement = ?,
      debit_account = ?,
      debit_amount = ?,
      credit_account = ?,
      credit_amount = ?,
      updated_at = ?
    WHERE id = ?`,
    entry.type,
    entry.date,
    entry.amount,
    entry.category ?? null,
    entry.paymentMethod ?? null,
    entry.memo,
    entry.partnerName ?? null,
    entry.costBehavior ?? null,
    entry.spendingJudgement ?? null,
    entry.debitAccount ?? null,
    entry.debitAmount ?? null,
    entry.creditAccount ?? null,
    entry.creditAmount ?? null,
    updatedAt,
    entry.id
  );

  if (result.changes === 0) {
    throw new Error("Accounting entry was not found.");
  }
}

export async function deleteAccountingEntry(id: string): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM accounting_entries WHERE id = ?`, id);
}

export async function seedAccountingEntriesIfEmpty(entries: AccountingEntry[]): Promise<void> {
  const currentEntries = await getAccountingEntries();

  if (currentEntries.length > 0) {
    return;
  }

  for (const entry of entries) {
    await insertAccountingEntry(entry);
  }
}

export async function clearAccountingEntries(): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM accounting_entries`);
}

function mapRowToEntry(row: AccountingEntryRow): AccountingEntry {
  return {
    id: row.id,
    type: row.type,
    date: row.date,
    amount: row.amount,
    category: row.category ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    memo: row.memo,
    partnerName: row.partner_name ?? undefined,
    costBehavior: row.cost_behavior ?? undefined,
    spendingJudgement: row.spending_judgement ?? undefined,
    debitAccount: row.debit_account ?? undefined,
    debitAmount: row.debit_amount ?? undefined,
    creditAccount: row.credit_account ?? undefined,
    creditAmount: row.credit_amount ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
