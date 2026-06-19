export const accountingDatabaseName = "company_investment_lab.db";

export const createAccountingEntriesTableSql = `
CREATE TABLE IF NOT EXISTS accounting_entries (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT,
  payment_method TEXT,
  memo TEXT NOT NULL,
  partner_name TEXT,
  cost_behavior TEXT,
  spending_judgement TEXT,
  debit_account TEXT,
  debit_amount REAL,
  credit_account TEXT,
  credit_amount REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;

export const createAccountingEntriesDateIndexSql = `
CREATE INDEX IF NOT EXISTS idx_accounting_entries_date
ON accounting_entries(date);
`;

export const createAccountingEntriesTypeIndexSql = `
CREATE INDEX IF NOT EXISTS idx_accounting_entries_type
ON accounting_entries(type);
`;
