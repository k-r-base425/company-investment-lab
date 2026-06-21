import { getAccountingDatabase, initAccountingDatabase } from "../db/accountingDatabase.native";
import type {
  ImprovementAction,
  ImprovementActionCategory,
  ImprovementActionPriority,
  ImprovementActionSource,
  ImprovementActionStatus,
  UpdateImprovementActionStatusParams
} from "../types/improvementAction";

type ImprovementActionRow = {
  id: string;
  period: string;
  title: string;
  description: string | null;
  category: ImprovementActionCategory;
  source: ImprovementActionSource;
  status: ImprovementActionStatus;
  priority: ImprovementActionPriority;
  source_insight_id: string | null;
  source_insight_title: string | null;
  source_action_index: number | null;
  action_key: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function initImprovementActionStorage(): Promise<void> {
  await initAccountingDatabase();
}

export async function getImprovementActions(): Promise<ImprovementAction[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<ImprovementActionRow>(
    `SELECT * FROM improvement_actions ORDER BY created_at DESC`
  );
  return rows.map(mapRowToAction);
}

export async function getImprovementActionsByPeriod(period: string): Promise<ImprovementAction[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<ImprovementActionRow>(
    `SELECT * FROM improvement_actions WHERE period = ? ORDER BY created_at DESC`,
    period
  );
  return rows.map(mapRowToAction);
}

export async function getImprovementActionById(id: string): Promise<ImprovementAction | null> {
  const database = await getAccountingDatabase();
  const row = await database.getFirstAsync<ImprovementActionRow>(
    `SELECT * FROM improvement_actions WHERE id = ? LIMIT 1`,
    id
  );
  return row ? mapRowToAction(row) : null;
}

export async function insertImprovementAction(action: ImprovementAction): Promise<void> {
  await insertAction(action);
}

export async function insertImprovementActions(actions: ImprovementAction[]): Promise<void> {
  for (const action of actions) {
    await insertAction(action);
  }
}

export async function upsertImprovementActionsByActionKey(actions: ImprovementAction[]): Promise<{
  insertedCount: number;
  skippedCount: number;
}> {
  const database = await getAccountingDatabase();
  let insertedCount = 0;
  let skippedCount = 0;

  for (const action of actions) {
    if (action.actionKey) {
      const existing = await database.getFirstAsync<{ id: string }>(
        `SELECT id FROM improvement_actions WHERE action_key = ? LIMIT 1`,
        action.actionKey
      );

      if (existing) {
        skippedCount += 1;
        continue;
      }
    }

    await insertAction(action);
    insertedCount += 1;
  }

  return {
    insertedCount,
    skippedCount
  };
}

export async function updateImprovementAction(action: ImprovementAction): Promise<void> {
  const database = await getAccountingDatabase();
  const updatedAt = new Date().toISOString();
  const result = await database.runAsync(
    `UPDATE improvement_actions
    SET
      period = ?,
      title = ?,
      description = ?,
      category = ?,
      source = ?,
      status = ?,
      priority = ?,
      source_insight_id = ?,
      source_insight_title = ?,
      source_action_index = ?,
      action_key = ?,
      due_date = ?,
      completed_at = ?,
      updated_at = ?
    WHERE id = ?`,
    action.period,
    action.title,
    action.description ?? null,
    action.category,
    action.source,
    action.status,
    action.priority,
    action.sourceInsightId ?? null,
    action.sourceInsightTitle ?? null,
    action.sourceActionIndex ?? null,
    action.actionKey ?? null,
    action.dueDate ?? null,
    action.completedAt ?? null,
    updatedAt,
    action.id
  );

  if (result.changes === 0) {
    throw new Error("Improvement action was not found.");
  }
}

export async function updateImprovementActionStatus({
  id,
  status
}: UpdateImprovementActionStatusParams): Promise<void> {
  const database = await getAccountingDatabase();
  const now = new Date().toISOString();
  const result = await database.runAsync(
    `UPDATE improvement_actions
    SET status = ?, completed_at = ?, updated_at = ?
    WHERE id = ?`,
    status,
    status === "done" ? now : null,
    now,
    id
  );

  if (result.changes === 0) {
    throw new Error("Improvement action was not found.");
  }
}

export async function deleteImprovementAction(id: string): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM improvement_actions WHERE id = ?`, id);
}

export async function clearImprovementActions(): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM improvement_actions`);
}

async function insertAction(action: ImprovementAction) {
  const database = await getAccountingDatabase();
  const now = new Date().toISOString();
  const createdAt = action.createdAt ?? now;
  const updatedAt = action.updatedAt ?? now;

  await database.runAsync(
    `INSERT OR REPLACE INTO improvement_actions (
      id,
      period,
      title,
      description,
      category,
      source,
      status,
      priority,
      source_insight_id,
      source_insight_title,
      source_action_index,
      action_key,
      due_date,
      completed_at,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    action.id,
    action.period,
    action.title,
    action.description ?? null,
    action.category,
    action.source,
    action.status,
    action.priority,
    action.sourceInsightId ?? null,
    action.sourceInsightTitle ?? null,
    action.sourceActionIndex ?? null,
    action.actionKey ?? null,
    action.dueDate ?? null,
    action.completedAt ?? null,
    createdAt,
    updatedAt
  );
}

function mapRowToAction(row: ImprovementActionRow): ImprovementAction {
  return {
    id: row.id,
    period: row.period,
    title: row.title,
    description: row.description ?? undefined,
    category: row.category,
    source: row.source,
    status: row.status,
    priority: row.priority,
    sourceInsightId: row.source_insight_id ?? undefined,
    sourceInsightTitle: row.source_insight_title ?? undefined,
    sourceActionIndex: row.source_action_index ?? undefined,
    actionKey: row.action_key ?? undefined,
    dueDate: row.due_date ?? undefined,
    completedAt: row.completed_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
