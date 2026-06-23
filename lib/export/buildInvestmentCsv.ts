import { calculateInvestmentHolding } from "../investment/calculateInvestment";
import type { InvestmentHolding } from "../types/investment";

const csvHeaders = [
  "id",
  "name",
  "ticker",
  "assetType",
  "positionType",
  "quantity",
  "averageCost",
  "currentPrice",
  "acquisitionAmount",
  "marketValue",
  "gainLoss",
  "gainLossRate",
  "dividendYield",
  "per",
  "pbr",
  "roe",
  "memo",
  "createdAt",
  "updatedAt"
];

export function buildInvestmentCsv(holdings: InvestmentHolding[]): string {
  const rows = holdings.map((holding) => {
    const calculated = calculateInvestmentHolding(holding);

    return [
      calculated.id,
      calculated.name,
      calculated.ticker,
      calculated.assetType,
      calculated.positionType,
      calculated.quantity,
      calculated.averageCost,
      calculated.currentPrice,
      calculated.acquisitionAmount,
      calculated.marketValue,
      calculated.gainLoss,
      calculated.gainLossRate,
      calculated.dividendYield,
      calculated.per,
      calculated.pbr,
      calculated.roe,
      calculated.memo,
      calculated.createdAt,
      calculated.updatedAt
    ];
  });

  return [csvHeaders, ...rows].map((row) => row.map(formatCsvValue).join(",")).join("\n");
}

function formatCsvValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "\"\"";
  }

  return `"${String(value).replace(/"/g, "\"\"")}"`;
}
