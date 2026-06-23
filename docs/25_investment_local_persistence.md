# 投資データのローカル保存

## 目的

投資管理画面で入力した保有銘柄をローカルに保存し、ページ再読み込み後も投資サマリー、保有銘柄リスト、資産配分に反映できるようにします。

今回は株価APIや証券口座APIには連携せず、価格や投資指標は手入力またはサンプル値として扱います。

## 保存方式

Web / GitHub Pages では `localStorage` を使います。

- key: `company-investment-lab:investment_holdings:v1`
- 保存データがない場合は空配列として扱う
- JSON parse に失敗してもアプリを落とさない
- サンプル銘柄は保存済みデータが空の場合だけ seed する

ネイティブでは既存SQLite DB `company_investment_lab.db` に `investment_holdings` テーブルを作ります。

## investment_holdings テーブル

```sql
CREATE TABLE IF NOT EXISTS investment_holdings (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  ticker TEXT,
  asset_type TEXT NOT NULL,
  position_type TEXT NOT NULL,
  quantity REAL NOT NULL,
  average_cost REAL NOT NULL,
  current_price REAL NOT NULL,
  dividend_yield REAL,
  per REAL,
  pbr REAL,
  roe REAL,
  memo TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

インデックス:

- `idx_investment_holdings_asset_type`
- `idx_investment_holdings_position_type`

## InvestmentHolding型

保存対象は `InvestmentHolding` です。

- `id`
- `name`
- `ticker`
- `assetType`
- `positionType`
- `quantity`
- `averageCost`
- `currentPrice`
- `dividendYield`
- `per`
- `pbr`
- `roe`
- `memo`
- `createdAt`
- `updatedAt`

## 追加・編集・削除の流れ

初期表示時:

1. `initInvestmentHoldingStorage()`
2. `seedInvestmentHoldingsIfEmpty(sampleInvestmentHoldings)`
3. `getInvestmentHoldings()`
4. 保存済みデータで画面を表示

追加時:

1. フォーム入力を検証
2. `insertInvestmentHolding`
3. `getInvestmentHoldings` で再読み込み
4. サマリーと資産配分を再計算

編集時:

1. 銘柄カードの「編集」でフォームへ読み込み
2. `updateInvestmentHolding`
3. `createdAt` は維持し、`updatedAt` を更新
4. 再読み込みして表示を更新

削除時:

1. 銘柄カードの「削除」を押す
2. `deleteInvestmentHolding`
3. 再読み込みして表示を更新

## 実保有 / 仮想保有フィルター

保存済みデータに対して以下のフィルターを適用します。

- 実保有: `positionType === "actual"`
- 仮想保有: `positionType === "virtual"`
- すべて: 両方

追加、編集、削除後も現在のフィルターを維持します。

## 投資サマリー再計算

投資サマリーは保存済み `InvestmentHolding[]` から `calculateInvestmentSummary` で再計算します。

- 取得金額
- 評価額
- 評価損益
- 評価損益率
- 現金比率
- 実保有評価額
- 仮想保有評価額

## 資産配分再計算

資産配分は保存済み `InvestmentHolding[]` から `buildInvestmentAllocation` で再計算します。

- 現金
- 日本株
- 米国株
- 投資信託
- ETF

## 今回できること

- 投資データをローカル保存できる
- 初回だけサンプル銘柄をseedできる
- 銘柄を追加、編集、削除できる
- ページ再読み込み後も保存データが残る
- 保存済みデータからサマリーと資産配分を再計算できる

## 今回やらないこと

- 株価API連携
- 証券口座API連携
- 投資データCSV/JSON出力
- ホーム投資KPI連動
- AI分析JSONへの投資データ反映
- 為替換算

## 将来拡張

- 投資データCSV/JSON出力
- ホーム投資KPI連動
- AI分析JSON連動
- 株価API
- 証券口座API
- 為替換算
