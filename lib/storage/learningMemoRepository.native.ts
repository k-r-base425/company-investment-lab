import { getAccountingDatabase, initAccountingDatabase } from "../db/accountingDatabase.native";
import type { LearningMemo, LearningMemoCategory, LearningMemoSource } from "../types/learningMemo";

type LearningMemoRow = {
  id: string;
  topic_id: string;
  topic_title: string;
  category: LearningMemoCategory;
  title: string;
  body: string;
  source: LearningMemoSource;
  source_ai_analysis_run_id: string | null;
  source_ai_analysis_run_title: string | null;
  related_screen: string | null;
  created_at: string;
  updated_at: string;
};

export async function initLearningMemoStorage(): Promise<void> {
  await initAccountingDatabase();
}

export async function getLearningMemos(): Promise<LearningMemo[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<LearningMemoRow>(`SELECT * FROM learning_memos ORDER BY created_at DESC`);
  return rows.map(mapRowToMemo);
}

export async function getLearningMemosByTopicId(topicId: string): Promise<LearningMemo[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<LearningMemoRow>(
    `SELECT * FROM learning_memos WHERE topic_id = ? ORDER BY created_at DESC`,
    topicId
  );
  return rows.map(mapRowToMemo);
}

export async function getLearningMemoById(id: string): Promise<LearningMemo | null> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<LearningMemoRow>(`SELECT * FROM learning_memos WHERE id = ? LIMIT 1`, id);
  return rows[0] ? mapRowToMemo(rows[0]) : null;
}

export async function insertLearningMemo(memo: LearningMemo): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO learning_memos (
      id,
      topic_id,
      topic_title,
      category,
      title,
      body,
      source,
      source_ai_analysis_run_id,
      source_ai_analysis_run_title,
      related_screen,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    memo.id,
    memo.topicId,
    memo.topicTitle,
    memo.category,
    memo.title,
    memo.body,
    memo.source,
    memo.sourceAiAnalysisRunId ?? null,
    memo.sourceAiAnalysisRunTitle ?? null,
    memo.relatedScreen ?? null,
    memo.createdAt,
    memo.updatedAt
  );
}

export async function updateLearningMemo(memo: LearningMemo): Promise<void> {
  const database = await getAccountingDatabase();
  const result = await database.runAsync(
    `UPDATE learning_memos
    SET
      topic_id = ?,
      topic_title = ?,
      category = ?,
      title = ?,
      body = ?,
      source = ?,
      source_ai_analysis_run_id = ?,
      source_ai_analysis_run_title = ?,
      related_screen = ?,
      updated_at = ?
    WHERE id = ?`,
    memo.topicId,
    memo.topicTitle,
    memo.category,
    memo.title,
    memo.body,
    memo.source,
    memo.sourceAiAnalysisRunId ?? null,
    memo.sourceAiAnalysisRunTitle ?? null,
    memo.relatedScreen ?? null,
    new Date().toISOString(),
    memo.id
  );

  if (result.changes === 0) {
    throw new Error("Learning memo was not found.");
  }
}

export async function deleteLearningMemo(id: string): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM learning_memos WHERE id = ?`, id);
}

export async function clearLearningMemos(): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM learning_memos`);
}

function mapRowToMemo(row: LearningMemoRow): LearningMemo {
  return {
    id: row.id,
    topicId: row.topic_id,
    topicTitle: row.topic_title,
    category: row.category,
    title: row.title,
    body: row.body,
    source: row.source,
    sourceAiAnalysisRunId: row.source_ai_analysis_run_id ?? undefined,
    sourceAiAnalysisRunTitle: row.source_ai_analysis_run_title ?? undefined,
    relatedScreen: row.related_screen ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
