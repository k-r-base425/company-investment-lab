import type { AccountingEntry } from "../types/accounting";

const storageKey = "company-investment-lab:accounting_entries:v1";

export async function initAccountingStorage() {
  return undefined;
}

export async function getAccountingEntries(): Promise<AccountingEntry[]> {
  return readEntries();
}

export async function getAccountingEntriesByMonth(month: string): Promise<AccountingEntry[]> {
  const entries = readEntries();
  return entries.filter((entry) => entry.date.startsWith(month));
}

export async function insertAccountingEntry(entry: AccountingEntry): Promise<void> {
  const entries = readEntries();
  const now = new Date().toISOString();
  const nextEntry = {
    ...entry,
    createdAt: entry.createdAt ?? now,
    updatedAt: now
  };

  writeEntries([nextEntry, ...entries.filter((currentEntry) => currentEntry.id !== entry.id)]);
}

export async function updateAccountingEntry(entry: AccountingEntry): Promise<void> {
  const entries = readEntries();
  const targetEntry = entries.find((currentEntry) => currentEntry.id === entry.id);

  if (!targetEntry) {
    throw new Error("Accounting entry was not found.");
  }

  const now = new Date().toISOString();
  const nextEntries = entries.map((currentEntry) =>
    currentEntry.id === entry.id
      ? {
          ...entry,
          createdAt: targetEntry.createdAt ?? entry.createdAt ?? now,
          updatedAt: now
        }
      : currentEntry
  );

  writeEntries(nextEntries);
}

export async function deleteAccountingEntry(id: string): Promise<void> {
  const entries = readEntries();
  writeEntries(entries.filter((entry) => entry.id !== id));
}

export async function seedAccountingEntriesIfEmpty(entries: AccountingEntry[]): Promise<void> {
  const currentEntries = readEntries();

  if (currentEntries.length > 0) {
    return;
  }

  const now = new Date().toISOString();
  writeEntries(
    entries.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt ?? now,
      updatedAt: entry.updatedAt ?? now
    }))
  );
}

export async function clearAccountingEntries(): Promise<void> {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.removeItem(storageKey);
}

function readEntries(): AccountingEntry[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const rawValue = globalThis.localStorage.getItem(storageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.filter(isAccountingEntryLike) : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: AccountingEntry[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.setItem(storageKey, JSON.stringify(entries));
}

function canUseLocalStorage() {
  return typeof globalThis.localStorage !== "undefined";
}

function isAccountingEntryLike(value: unknown): value is AccountingEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<AccountingEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.type === "string" &&
    typeof entry.date === "string" &&
    typeof entry.amount === "number" &&
    typeof entry.memo === "string"
  );
}
