import type { InvestmentHolding } from "../types/investment";

export const sampleInvestmentHoldings: InvestmentHolding[] = [
  {
    id: "sample-cash",
    name: "現金",
    ticker: "CASH",
    assetType: "cash",
    positionType: "actual",
    quantity: 1,
    averageCost: 4250000,
    currentPrice: 4250000,
    memo: "生活防衛資金と投資待機資金"
  },
  {
    id: "sample-toyota",
    name: "トヨタ自動車",
    ticker: "7203",
    assetType: "japanese_stock",
    positionType: "actual",
    quantity: 100,
    averageCost: 2800,
    currentPrice: 3100,
    dividendYield: 0.028,
    per: 10.5,
    pbr: 1.2,
    roe: 0.11,
    memo: "日本株の大型株サンプル"
  },
  {
    id: "sample-vti",
    name: "米国ETF VTI",
    ticker: "VTI",
    assetType: "etf",
    positionType: "actual",
    quantity: 10,
    averageCost: 230,
    currentPrice: 250,
    dividendYield: 0.015,
    per: 22.0,
    pbr: 3.8,
    roe: 0.18,
    memo: "米国市場全体に分散するETFサンプル"
  },
  {
    id: "sample-orcan",
    name: "全世界株式インデックス",
    ticker: "ORCAN",
    assetType: "mutual_fund",
    positionType: "actual",
    quantity: 1200000,
    averageCost: 1,
    currentPrice: 1.12,
    dividendYield: 0,
    memo: "投資信託サンプル"
  },
  {
    id: "sample-nintendo",
    name: "任天堂",
    ticker: "7974",
    assetType: "japanese_stock",
    positionType: "virtual",
    quantity: 100,
    averageCost: 7800,
    currentPrice: 8200,
    dividendYield: 0.018,
    per: 25.0,
    pbr: 3.5,
    roe: 0.14,
    memo: "仮想保有で値動きと指標を学習するサンプル"
  },
  {
    id: "sample-apple",
    name: "Apple",
    ticker: "AAPL",
    assetType: "us_stock",
    positionType: "virtual",
    quantity: 5,
    averageCost: 180,
    currentPrice: 195,
    dividendYield: 0.005,
    per: 30.0,
    pbr: 40.0,
    roe: 1.2,
    memo: "米国株の仮想保有サンプル"
  }
];
