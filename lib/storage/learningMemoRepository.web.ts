import type { LearningMemo } from "../types/learningMemo";

const storageKey = "company-investment-lab:learning_memos:v1";

export async function initLearningMemoStorage() {
  return undefined;
}

export async function getLearningMemos(): Promise<LearningMemo[]> {
  return sortMemos(readMemos());
}

export async function getLearningMemosByTopicId(topicId: string): Promise<LearningMemo[]> {
  return sortMemos(readMemos().filter((memo) => memo.topicId === topicId));
}

export async function getLearningMemoById(id: string): Promise<LearningMemo | null> {
  return readMemos().find((memo) => memo.id === id) ?? null;
}

export async function insertLearningMemo(memo: LearningMemo): Promise<void> {
  const memos = readMemos();
  writeMemos([memo, ...memos.filter((currentMemo) => currentMemo.id !== memo.id)]);
}

export async function updateLearningMemo(memo: LearningMemo): Promise<void> {
  const memos = readMemos();
  const currentMemo = memos.find((candidate) => candidate.id === memo.id);

  if (!currentMemo) {
    throw new Error("Learning memo was not found.");
  }

  writeMemos(
    memos.map((candidate) =>
      candidate.id === memo.id
        ? {
            ...memo,
            createdAt: currentMemo.createdAt,
            updatedAt: new Date().toISOString()
          }
        : candidate
    )
  );
}

export async function deleteLearningMemo(id: string): Promise<void> {
  writeMemos(readMemos().filter((memo) => memo.id !== id));
}

export async function clearLearningMemos(): Promise<void> {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.removeItem(storageKey);
}

function readMemos(): LearningMemo[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const rawValue = globalThis.localStorage.getItem(storageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.filter(isLearningMemoLike) : [];
  } catch {
    return [];
  }
}

function writeMemos(memos: LearningMemo[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.setItem(storageKey, JSON.stringify(memos));
}

function canUseLocalStorage() {
  return typeof globalThis.localStorage !== "undefined";
}

function sortMemos(memos: LearningMemo[]) {
  return [...memos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function isLearningMemoLike(value: unknown): value is LearningMemo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const memo = value as Partial<LearningMemo>;
  return (
    typeof memo.id === "string" &&
    typeof memo.topicId === "string" &&
    typeof memo.topicTitle === "string" &&
    typeof memo.category === "string" &&
    typeof memo.title === "string" &&
    typeof memo.body === "string" &&
    typeof memo.source === "string" &&
    typeof memo.createdAt === "string" &&
    typeof memo.updatedAt === "string"
  );
}
