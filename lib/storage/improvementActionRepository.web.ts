import type { ImprovementAction, UpdateImprovementActionStatusParams } from "../types/improvementAction";

const storageKey = "company-investment-lab:improvement_actions:v1";

export async function initImprovementActionStorage() {
  return undefined;
}

export async function getImprovementActions(): Promise<ImprovementAction[]> {
  return readActions();
}

export async function getImprovementActionsByPeriod(period: string): Promise<ImprovementAction[]> {
  return readActions().filter((action) => action.period === period);
}

export async function getImprovementActionById(id: string): Promise<ImprovementAction | null> {
  return readActions().find((action) => action.id === id) ?? null;
}

export async function insertImprovementAction(action: ImprovementAction): Promise<void> {
  const actions = readActions();
  const now = new Date().toISOString();
  const nextAction = {
    ...action,
    createdAt: action.createdAt ?? now,
    updatedAt: now
  };

  writeActions([nextAction, ...actions.filter((currentAction) => currentAction.id !== action.id)]);
}

export async function insertImprovementActions(actions: ImprovementAction[]): Promise<void> {
  const currentActions = readActions();
  const now = new Date().toISOString();
  const nextActions = actions.map((action) => ({
    ...action,
    createdAt: action.createdAt ?? now,
    updatedAt: action.updatedAt ?? now
  }));
  const nextIds = new Set(nextActions.map((action) => action.id));

  writeActions([...nextActions, ...currentActions.filter((action) => !nextIds.has(action.id))]);
}

export async function upsertImprovementActionsByActionKey(actions: ImprovementAction[]): Promise<{
  insertedCount: number;
  skippedCount: number;
}> {
  const currentActions = readActions();
  const existingActionKeys = new Set(currentActions.map((action) => action.actionKey).filter(Boolean));
  const existingIds = new Set(currentActions.map((action) => action.id));
  const now = new Date().toISOString();
  const insertedActions: ImprovementAction[] = [];
  let skippedCount = 0;

  for (const action of actions) {
    if ((action.actionKey && existingActionKeys.has(action.actionKey)) || existingIds.has(action.id)) {
      skippedCount += 1;
      continue;
    }

    insertedActions.push({
      ...action,
      createdAt: action.createdAt ?? now,
      updatedAt: action.updatedAt ?? now
    });

    if (action.actionKey) {
      existingActionKeys.add(action.actionKey);
    }
    existingIds.add(action.id);
  }

  writeActions([...insertedActions, ...currentActions]);

  return {
    insertedCount: insertedActions.length,
    skippedCount
  };
}

export async function updateImprovementAction(action: ImprovementAction): Promise<void> {
  const actions = readActions();
  const targetAction = actions.find((currentAction) => currentAction.id === action.id);

  if (!targetAction) {
    throw new Error("Improvement action was not found.");
  }

  const now = new Date().toISOString();
  const nextActions = actions.map((currentAction) =>
    currentAction.id === action.id
      ? {
          ...action,
          createdAt: targetAction.createdAt ?? action.createdAt ?? now,
          updatedAt: now
        }
      : currentAction
  );

  writeActions(nextActions);
}

export async function updateImprovementActionStatus({
  id,
  status
}: UpdateImprovementActionStatusParams): Promise<void> {
  const actions = readActions();
  const targetAction = actions.find((action) => action.id === id);

  if (!targetAction) {
    throw new Error("Improvement action was not found.");
  }

  const now = new Date().toISOString();
  writeActions(
    actions.map((action) =>
      action.id === id
        ? {
            ...action,
            status,
            completedAt: status === "done" ? now : undefined,
            updatedAt: now
          }
        : action
    )
  );
}

export async function deleteImprovementAction(id: string): Promise<void> {
  writeActions(readActions().filter((action) => action.id !== id));
}

export async function clearImprovementActions(): Promise<void> {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.removeItem(storageKey);
}

function readActions(): ImprovementAction[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const rawValue = globalThis.localStorage.getItem(storageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.filter(isImprovementActionLike) : [];
  } catch {
    return [];
  }
}

function writeActions(actions: ImprovementAction[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.setItem(storageKey, JSON.stringify(actions));
}

function canUseLocalStorage() {
  return typeof globalThis.localStorage !== "undefined";
}

function isImprovementActionLike(value: unknown): value is ImprovementAction {
  if (!value || typeof value !== "object") {
    return false;
  }

  const action = value as Partial<ImprovementAction>;
  return (
    typeof action.id === "string" &&
    typeof action.period === "string" &&
    typeof action.title === "string" &&
    typeof action.category === "string" &&
    typeof action.source === "string" &&
    typeof action.status === "string" &&
    typeof action.priority === "string" &&
    typeof action.createdAt === "string" &&
    typeof action.updatedAt === "string"
  );
}
