import type { AiAnalysisRun, UpdateAiAnalysisRunResponseParams } from "../types/aiAnalysisRun";

const storageKey = "company-investment-lab:ai_analysis_runs:v1";

export async function initAiAnalysisRunStorage() {
  return undefined;
}

export async function getAiAnalysisRuns(): Promise<AiAnalysisRun[]> {
  return sortRuns(readRuns());
}

export async function getAiAnalysisRunsByPeriod(period: string): Promise<AiAnalysisRun[]> {
  return sortRuns(readRuns().filter((run) => run.period === period));
}

export async function getAiAnalysisRunById(id: string): Promise<AiAnalysisRun | null> {
  return readRuns().find((run) => run.id === id) ?? null;
}

export async function insertAiAnalysisRun(run: AiAnalysisRun): Promise<void> {
  const runs = readRuns();
  writeRuns([run, ...runs.filter((currentRun) => currentRun.id !== run.id)]);
}

export async function updateAiAnalysisRun(run: AiAnalysisRun): Promise<void> {
  const runs = readRuns();
  const currentRun = runs.find((candidate) => candidate.id === run.id);

  if (!currentRun) {
    throw new Error("AI analysis run was not found.");
  }

  writeRuns(
    runs.map((candidate) =>
      candidate.id === run.id
        ? {
            ...run,
            createdAt: currentRun.createdAt,
            updatedAt: new Date().toISOString()
          }
        : candidate
    )
  );
}

export async function updateAiAnalysisRunResponse({
  id,
  responseText,
  memo,
  nextAction
}: UpdateAiAnalysisRunResponseParams): Promise<void> {
  const runs = readRuns();
  const currentRun = runs.find((run) => run.id === id);

  if (!currentRun) {
    throw new Error("AI analysis run was not found.");
  }

  const now = new Date().toISOString();
  writeRuns(
    runs.map((run) =>
      run.id === id
        ? {
            ...run,
            responseText,
            memo,
            nextAction,
            status: "response_saved",
            updatedAt: now
          }
        : run
    )
  );
}

export async function deleteAiAnalysisRun(id: string): Promise<void> {
  writeRuns(readRuns().filter((run) => run.id !== id));
}

export async function clearAiAnalysisRuns(): Promise<void> {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.removeItem(storageKey);
}

function readRuns(): AiAnalysisRun[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const rawValue = globalThis.localStorage.getItem(storageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.filter(isAiAnalysisRunLike) : [];
  } catch {
    return [];
  }
}

function writeRuns(runs: AiAnalysisRun[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.setItem(storageKey, JSON.stringify(runs));
}

function canUseLocalStorage() {
  return typeof globalThis.localStorage !== "undefined";
}

function sortRuns(runs: AiAnalysisRun[]) {
  return [...runs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function isAiAnalysisRunLike(value: unknown): value is AiAnalysisRun {
  if (!value || typeof value !== "object") {
    return false;
  }

  const run = value as Partial<AiAnalysisRun>;
  return (
    typeof run.id === "string" &&
    typeof run.period === "string" &&
    typeof run.title === "string" &&
    typeof run.theme === "string" &&
    typeof run.status === "string" &&
    typeof run.promptText === "string" &&
    typeof run.payloadJson === "string" &&
    typeof run.source === "string" &&
    typeof run.createdAt === "string" &&
    typeof run.updatedAt === "string"
  );
}
