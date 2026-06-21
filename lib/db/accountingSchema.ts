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

export const createImprovementActionsTableSql = `
CREATE TABLE IF NOT EXISTS improvement_actions (
  id TEXT PRIMARY KEY NOT NULL,
  period TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  source_insight_id TEXT,
  source_insight_title TEXT,
  source_action_index INTEGER,
  action_key TEXT,
  due_date TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;

export const createImprovementActionsPeriodIndexSql = `
CREATE INDEX IF NOT EXISTS idx_improvement_actions_period
ON improvement_actions(period);
`;

export const createImprovementActionsStatusIndexSql = `
CREATE INDEX IF NOT EXISTS idx_improvement_actions_status
ON improvement_actions(status);
`;

export const createImprovementActionsActionKeyIndexSql = `
CREATE INDEX IF NOT EXISTS idx_improvement_actions_action_key
ON improvement_actions(action_key);
`;
