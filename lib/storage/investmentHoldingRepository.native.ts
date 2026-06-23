import { getAccountingDatabase, initAccountingDatabase } from "../db/accountingDatabase.native";
import type { InvestmentAssetType, InvestmentHolding, InvestmentPositionType } from "../types/investment";

type InvestmentHoldingRow = {
  id: string;
  name: string;
  ticker: string | null;
  asset_type: InvestmentAssetType;
  position_type: InvestmentPositionType;
  quantity: number;
  average_cost: number;
  current_price: number;
  dividend_yield: number | null;
  per: number | null;
  pbr: number | null;
  roe: number | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

export async function initInvestmentHoldingStorage(): Promise<void> {
  await initAccountingDatabase();
}

export async function getInvestmentHoldings(): Promise<InvestmentHolding[]> {
  const database = await getAccountingDatabase();
  const rows = await database.getAllAsync<InvestmentHoldingRow>(
    `SELECT * FROM investment_holdings ORDER BY created_at DESC`
  );
  return rows.map(mapRowToHolding);
}

export async function getInvestmentHoldingById(id: string): Promise<InvestmentHolding | null> {
  const database = await getAccountingDatabase();
  const row = await database.getFirstAsync<InvestmentHoldingRow>(
    `SELECT * FROM investment_holdings WHERE id = ?`,
    id
  );
  return row ? mapRowToHolding(row) : null;
}

export async function insertInvestmentHolding(holding: InvestmentHolding): Promise<void> {
  const database = await getAccountingDatabase();
  const now = new Date().toISOString();
  const createdAt = holding.createdAt ?? now;
  const updatedAt = holding.updatedAt ?? now;

  await database.runAsync(
    `INSERT OR REPLACE INTO investment_holdings (
      id,
      name,
      ticker,
      asset_type,
      position_type,
      quantity,
      average_cost,
      current_price,
      dividend_yield,
      per,
      pbr,
      roe,
      memo,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    holding.id,
    holding.name,
    holding.ticker ?? null,
    holding.assetType,
    holding.positionType,
    holding.quantity,
    holding.averageCost,
    holding.currentPrice,
    holding.dividendYield ?? null,
    holding.per ?? null,
    holding.pbr ?? null,
    holding.roe ?? null,
    holding.memo ?? null,
    createdAt,
    updatedAt
  );
}

export async function updateInvestmentHolding(holding: InvestmentHolding): Promise<void> {
  const database = await getAccountingDatabase();
  const updatedAt = new Date().toISOString();

  const result = await database.runAsync(
    `UPDATE investment_holdings
    SET
      name = ?,
      ticker = ?,
      asset_type = ?,
      position_type = ?,
      quantity = ?,
      average_cost = ?,
      current_price = ?,
      dividend_yield = ?,
      per = ?,
      pbr = ?,
      roe = ?,
      memo = ?,
      updated_at = ?
    WHERE id = ?`,
    holding.name,
    holding.ticker ?? null,
    holding.assetType,
    holding.positionType,
    holding.quantity,
    holding.averageCost,
    holding.currentPrice,
    holding.dividendYield ?? null,
    holding.per ?? null,
    holding.pbr ?? null,
    holding.roe ?? null,
    holding.memo ?? null,
    updatedAt,
    holding.id
  );

  if (result.changes === 0) {
    throw new Error("Investment holding was not found.");
  }
}

export async function deleteInvestmentHolding(id: string): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM investment_holdings WHERE id = ?`, id);
}

export async function seedInvestmentHoldingsIfEmpty(holdings: InvestmentHolding[]): Promise<void> {
  const currentHoldings = await getInvestmentHoldings();

  if (currentHoldings.length > 0) {
    return;
  }

  for (const holding of holdings) {
    await insertInvestmentHolding(holding);
  }
}

export async function clearInvestmentHoldings(): Promise<void> {
  const database = await getAccountingDatabase();
  await database.runAsync(`DELETE FROM investment_holdings`);
}

function mapRowToHolding(row: InvestmentHoldingRow): InvestmentHolding {
  return {
    id: row.id,
    name: row.name,
    ticker: row.ticker ?? undefined,
    assetType: row.asset_type,
    positionType: row.position_type,
    quantity: row.quantity,
    averageCost: row.average_cost,
    currentPrice: row.current_price,
    dividendYield: row.dividend_yield ?? undefined,
    per: row.per ?? undefined,
    pbr: row.pbr ?? undefined,
    roe: row.roe ?? undefined,
    memo: row.memo ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
