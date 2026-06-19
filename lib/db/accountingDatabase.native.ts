import * as SQLite from "expo-sqlite";

import {
  accountingDatabaseName,
  createAiAnalysisRunsCreatedAtIndexSql,
  createAiAnalysisRunsPeriodIndexSql,
  createAiAnalysisRunsTableSql,
  createAccountingEntriesDateIndexSql,
  createAccountingEntriesTableSql,
  createAccountingEntriesTypeIndexSql
} from "./accountingSchema";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getAccountingDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(accountingDatabaseName);
  }

  return databasePromise;
}

export async function initAccountingDatabase() {
  const database = await getAccountingDatabase();
  await database.execAsync(createAccountingEntriesTableSql);
  await database.execAsync(createAccountingEntriesDateIndexSql);
  await database.execAsync(createAccountingEntriesTypeIndexSql);
  await database.execAsync(createAiAnalysisRunsTableSql);
  await database.execAsync(createAiAnalysisRunsPeriodIndexSql);
  await database.execAsync(createAiAnalysisRunsCreatedAtIndexSql);
}
