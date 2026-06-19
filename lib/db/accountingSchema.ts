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

export const createAiAnalysisRunsTableSql = `
CREATE TABLE IF NOT EXISTS ai_analysis_runs (
  id TEXT PRIMARY KEY NOT NULL,
  period TEXT NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  status TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  response_text TEXT,
  memo TEXT,
  next_action TEXT,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;

export const createAiAnalysisRunsPeriodIndexSql = `
CREATE INDEX IF NOT EXISTS idx_ai_analysis_runs_period
ON ai_analysis_runs(period);
`;

export const createAiAnalysisRunsCreatedAtIndexSql = `
CREATE INDEX IF NOT EXISTS idx_ai_analysis_runs_created_at
ON ai_analysis_runs(created_at);
`;
