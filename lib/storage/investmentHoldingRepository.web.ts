import type { InvestmentHolding } from "../types/investment";

const storageKey = "company-investment-lab:investment_holdings:v1";

export async function initInvestmentHoldingStorage() {
  return undefined;
}

export async function getInvestmentHoldings(): Promise<InvestmentHolding[]> {
  return readHoldings();
}

export async function getInvestmentHoldingById(id: string): Promise<InvestmentHolding | null> {
  return readHoldings().find((holding) => holding.id === id) ?? null;
}

export async function insertInvestmentHolding(holding: InvestmentHolding): Promise<void> {
  const holdings = readHoldings();
  const now = new Date().toISOString();
  const nextHolding = {
    ...holding,
    createdAt: holding.createdAt ?? now,
    updatedAt: holding.updatedAt ?? now
  };

  writeHoldings([nextHolding, ...holdings.filter((currentHolding) => currentHolding.id !== holding.id)]);
}

export async function updateInvestmentHolding(holding: InvestmentHolding): Promise<void> {
  const holdings = readHoldings();
  const targetHolding = holdings.find((currentHolding) => currentHolding.id === holding.id);

  if (!targetHolding) {
    throw new Error("Investment holding was not found.");
  }

  const now = new Date().toISOString();
  writeHoldings(
    holdings.map((currentHolding) =>
      currentHolding.id === holding.id
        ? {
            ...holding,
            createdAt: targetHolding.createdAt ?? holding.createdAt ?? now,
            updatedAt: now
          }
        : currentHolding
    )
  );
}

export async function deleteInvestmentHolding(id: string): Promise<void> {
  writeHoldings(readHoldings().filter((holding) => holding.id !== id));
}

export async function seedInvestmentHoldingsIfEmpty(holdings: InvestmentHolding[]): Promise<void> {
  const currentHoldings = readHoldings();

  if (currentHoldings.length > 0) {
    return;
  }

  const now = new Date().toISOString();
  writeHoldings(
    holdings.map((holding) => ({
      ...holding,
      createdAt: holding.createdAt ?? now,
      updatedAt: holding.updatedAt ?? now
    }))
  );
}

export async function clearInvestmentHoldings(): Promise<void> {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.removeItem(storageKey);
}

function readHoldings(): InvestmentHolding[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const rawValue = globalThis.localStorage.getItem(storageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.filter(isInvestmentHoldingLike) : [];
  } catch {
    return [];
  }
}

function writeHoldings(holdings: InvestmentHolding[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  globalThis.localStorage.setItem(storageKey, JSON.stringify(holdings));
}

function canUseLocalStorage() {
  return typeof globalThis.localStorage !== "undefined";
}

function isInvestmentHoldingLike(value: unknown): value is InvestmentHolding {
  if (!value || typeof value !== "object") {
    return false;
  }

  const holding = value as Partial<InvestmentHolding>;
  return (
    typeof holding.id === "string" &&
    typeof holding.name === "string" &&
    typeof holding.assetType === "string" &&
    typeof holding.positionType === "string" &&
    typeof holding.quantity === "number" &&
    typeof holding.averageCost === "number" &&
    typeof holding.currentPrice === "number"
  );
}
