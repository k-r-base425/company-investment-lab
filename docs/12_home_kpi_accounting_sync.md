# ホームKPI会計データ連動

## 目的

ホーム画面の主要KPIを、保存済みの会計入力データから計算して表示します。

これにより、会計入力画面で追加・編集・削除した売上、経費、家計支出が、ホームダッシュボードの数字へ反映されます。

## 対象月

MVPでは対象月を固定します。

- month: `2026-06`
- 表示: `2026年6月`

## 連動するKPI

保存済み会計入力データから、以下のKPIを計算します。

- 売上
- 経費
- 利益
- 税金目安
- 投資可能額
- 家計支出

## サンプル値のままのKPI

投資入力画面や学習進捗の永続化はまだ未実装のため、以下はサンプル値を維持します。

- 総資産
- 現金比率
- 投資損益
- 学習進捗

## 使用する集計関数

ホームKPIは `calculateMonthlyAccountingSummary(entries, "2026-06")` を使って計算します。

主な計算項目:

- `revenueTotal`
- `expenseTotal`
- `householdTotal`
- `profit`
- `estimatedTax`
- `investableAmount`
- `expenseRatio`
- `profitMargin`
- `entryCount`

## 会計入力データからホームKPIを作る流れ

1. ホーム画面表示時に `initAccountingStorage()` を呼ぶ
2. `getAccountingEntriesByMonth("2026-06")` で保存済み会計データを読み込む
3. 保存済みデータがあれば、そのデータを使う
4. 保存済みデータが空なら、保存せず表示用に `sampleAccountingEntries` を使う
5. `buildHomeKpisFromAccounting` でKPIカード用データを作る
6. `HomeKpiGrid` に渡して表示する

手動更新ボタン「データを更新」でも再読み込みできます。

## AI分析JSONとの整合性

ホームKPIとAI分析JSONは、同じ会計集計関数を使います。

これにより、ホームKPIの売上・経費・利益と、AI分析JSONの `business.revenue` / `business.expenses` / `business.profit` が同じ値になります。

## 保存方式

Web / GitHub Pagesでは `localStorage` fallback を使います。

ネイティブ実行では SQLite Repository を使います。

Web用ファイルから `expo-sqlite` を直接importしない方針は維持します。

## 今回できること

- ホームKPIの売上・経費・利益・税金目安・投資可能額・家計支出を保存済み会計データに連動
- 保存済みデータが空の場合のサンプル表示
- 読み込みエラー時のサンプルフォールバック
- 手動更新ボタンによる再読み込み

## 今回やらないこと

- 月選択
- 前年比の本格計算
- ホーム月グラフの保存データ連動
- 投資KPIの保存データ連動
- 学習進捗の保存データ連動
- API連携

## 将来拡張

- 月選択
- カテゴリ別前月比
- ホーム月グラフ連動
- 投資KPI連動
- 学習進捗連動
- 期間比較
