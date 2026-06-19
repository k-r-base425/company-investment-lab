import { getAccountingDatabase, initAccountingDatabase } from "../db/accountingDatabase.native";
import type {
  AiAnalysisRun,
  AiAnalysisRunStatus,
  AiAnalysisTheme,
  UpdateAiAnalysisRunResponseParams
} from "../types/aiAnalysisRun";

type AiAnalysisRunRow = {
  id: string;
  period: string;
  title: string;
  theme: AiAnalysisTheme;
  status: AiAnalysisRunStatus;
  prompt_text: string;
  payload_json: string;
  response_text: string | null;
  memo: string | null;
  next_action: string | null;
  source: AiAnalysisRun["source"];
  created_at: string;
  updated_at: string;
};

export async function initAiAnalysisRunStorage(): Promise<void> {
  await initAccountingDatabase();
}

export async function getAiAnalysisRuns(): Promise<AiAnalysisRun[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<AiAnalysisRunRow>(
    `SELECT * FROM ai_analysis_runs ORDER BY created_at DESC`
  );
  return rows.map(mapRowToRun);
}

export async function getAiAnalysisRunsByPeriod(period: string): Promise<AiAnalysisRun[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<AiAnalysisRunRow>(
    `SELECT * FROM ai_analysis_runs WHERE period = ? ORDER BY created_at DESC`,
    period
  );
  return rows.map(mapRowToRun);
}

export async function getAiAnalysisRunById(id: string): Promise<AiAnalysisRun | null> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<AiAnalysisRunRow>(
    `SELECT * FROM ai_analysis_runs WHERE id = ? LIMIT 1`,
    id
  );
  return rows[0] ? mapRowToRun(rows[0]) : null;
}

export async function insertAiAnalysisRun(run: AiAnalysisRun): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO ai_analysis_runs (
      id,
      period,
      title,
      theme,
      status,
      prompt_text,
      payload_json,
      response_text,
      memo,
      next_action,
      source,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    run.id,
    run.period,
    run.title,
    run.theme,
    run.status,
    run.promptText,
    run.payloadJson,
    run.responseText ?? null,
    run.memo ?? null,
    run.nextAction ?? null,
    run.source,
    run.createdAt,
    run.updatedAt
  );
}

export async function updateAiAnalysisRun(run: AiAnalysisRun): Promise<void> {
  const database = await getAccountingDatabase();
  const result = await database.runAsync(
    `UPDATE ai_analysis_runs
    SET
      period = ?,
      title = ?,
      theme = ?,
      status = ?,
      prompt_text = ?,
      payload_json = ?,
      response_text = ?,
      memo = ?,
      next_action = ?,
      source = ?,
      updated_at = ?
    WHERE id = ?`,
    run.period,
    run.title,
    run.theme,
    run.status,
    run.promptText,
    run.payloadJson,
    run.responseText ?? null,
    run.memo ?? null,
    run.nextAction ?? null,
    run.source,
    new Date().toISOString(),
    run.id
  );

  if (result.changes === 0) {
    throw new Error("AI analysis run was not found.");
  }
}

export async function updateAiAnalysisRunResponse({
  id,
  responseText,
  memo,
  nextAction
}: UpdateAiAnalysisRunResponseParams): Promise<void> {
  const database = await getAccountingDatabase();
  const result = await database.runAsync(
    `UPDATE ai_analysis_runs
    SET
      response_text = ?,
      memo = ?,
      next_action = ?,
      status = ?,
      updated_at = ?
    WHERE id = ?`,
    responseText,
    memo ?? null,
    nextAction ?? null,
    "response_saved",
    new Date().toISOString(),
    id
  );

  if (result.changes === 0) {
    throw new Error("AI analysis run was not found.");
  }
}

export async function deleteAiAnalysisRun(id: string): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM ai_analysis_runs WHERE id = ?`, id);
}

export async function clearAiAnalysisRuns(): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM ai_analysis_runs`);
}

function mapRowToRun(row: AiAnalysisRunRow): AiAnalysisRun {
  return {
    id: row.id,
    period: row.period,
    title: row.title,
    theme: row.theme,
    status: row.status,
    promptText: row.prompt_text,
    payloadJson: row.payload_json,
    responseText: row.response_text ?? undefined,
    memo: row.memo ?? undefined,
    nextAction: row.next_action ?? undefined,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
