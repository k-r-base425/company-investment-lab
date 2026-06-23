# ホーム投資KPI・資産配分の保存済み投資データ連動

## 目的

ホーム画面の総資産、現金比率、投資損益、資産配分カードを、投資タブで保存した保有銘柄データから計算します。

## 投資タブ保存データをホームへ反映する流れ

ホーム表示時に `initInvestmentHoldingStorage()` と `getInvestmentHoldings()` を呼びます。保存済み投資データがある場合はそれを使い、保存済みデータが空の場合だけ表示用に `sampleInvestmentHoldings` を使います。

ホームではサンプル投資データを保存しません。投資タブ側の `seedInvestmentHoldingsIfEmpty(sampleInvestmentHoldings)` はそのまま維持します。

## ホーム投資KPI

- 総資産: `marketValueTotal`
- 現金比率: `cashValue / marketValueTotal`
- 投資損益: `marketValueTotal - acquisitionTotal`
- 評価損益率: `gainLossTotal / acquisitionTotal`

計算は `calculateInvestmentSummary()` と `buildHomeKpisFromInvestment()` を使います。

## 資産配分カード

`assetType` ごとに `quantity * currentPrice` を合計します。

- 現金
- 日本株
- 米国株
- 投資信託
- ETF

割合は `assetTypeMarketValue / marketValueTotal` です。ホームカード表示では既存UIに合わせて百分率で表示します。

## サンプル表示

保存済み投資データが空の場合は、表示用に `sampleInvestmentHoldings` を使います。この fallback は保存しないため、ホームを開くだけでサンプル銘柄が重複追加されることはありません。

## AI分析JSON

`buildInvestmentAnalysisPayload()` で生成した investment を `buildHomeAiAnalysisPayload()` に含めます。保存済み投資データが空の場合は、コピー直前にサンプル投資データを表示用として使います。

## JSONエクスポート

`buildAccountingJson()` にも investment を含めます。既存の会計JSON構造は維持し、投資データは `summary`、`holdings`、`allocation` を含む形で追加します。

## 今回できること

- ホーム投資KPIを保存済み投資データから計算する
- ホーム資産配分カードを保存済み投資データから計算する
- AI分析JSONに投資データを含める
- JSONエクスポート用payloadに投資データを含める

## 今回やらないこと

- 投資データCSV出力
- 投資履歴管理
- 株価API連携
- 証券口座API連携
- 為替換算

## 将来拡張

- 投資CSV/JSON出力
- 投資履歴
- ホーム投資グラフ
- 株価API
- 為替換算
- 証券口座API
