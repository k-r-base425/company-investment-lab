# 会計改善コメント

## 目的

保存済み会計入力データから、次に見直すべきポイントをルールベースで表示する。

経費率、利益率、投資可能額、固定費、浪費、投資支出などを毎月確認し、会計・家計・投資判断の学習につなげる。

## 方針

改善コメントはAI APIではなく、アプリ内のローカルロジックで生成する。

理由:

- GitHub Pagesやネイティブ実行でオフライン寄りに確認できる
- AI APIキーや外部API連携をMVPに含めない
- 会計画面、AI分析JSON、JSONエクスポートで同じ判定結果を使える

## 判定に使う指標

- 経費率
- 利益率
- 投資可能額
- 固定費比率
- 浪費比率
- 投資支出比率
- 支出カテゴリの偏り
- 税金目安
- 入力件数

## 判定ルール

### 経費率

`expenseRatio = expenseTotal / revenueTotal`

- `expenseRatio >= 0.70`: `danger`
- `expenseRatio >= 0.50`: `warning`
- `expenseRatio <= 0.30`: `good`
- それ以外: `notice`

売上が0の場合、経費率コメントは出さない。

### 利益率

`profitMargin = profit / revenueTotal`

- `profit < 0`: `danger`
- `profitMargin < 0.20`: `warning`
- `profitMargin >= 0.50`: `good`
- それ以外: `notice`

売上が0の場合、利益率コメントは出さない。

### 投資可能額

`investableAmount = profit - estimatedTax - livingCost - businessReserve`

- `investableAmount < 0`: `danger`
- `investableAmount < 100000`: `warning`
- `investableAmount >= 300000`: `good`
- それ以外: `notice`

### 固定費比率

対象は `expense` と `household`。

`fixedCostRatio = fixed / (fixed + variable)`

- `fixedCostRatio >= 0.75`: `danger`
- `fixedCostRatio >= 0.60`: `warning`
- `fixedCostRatio <= 0.40`: `good`
- それ以外: `notice`

支出合計が0の場合は出さない。

### 浪費比率

対象は `expense` と `household`。

`wasteRatio = waste / totalJudgedSpending`

- `wasteRatio >= 0.35`: `danger`
- `wasteRatio >= 0.20`: `warning`
- `wasteRatio <= 0.10`: `good`
- それ以外: `notice`

判定済み支出が0の場合は出さない。

### 投資支出比率

対象は `expense` と `household`。

`investmentSpendingRatio = investment / totalJudgedSpending`

- `investmentSpendingRatio < 0.05`: `notice`
- `investmentSpendingRatio >= 0.15`: `good`

判定済み支出が0の場合は出さない。

### カテゴリ偏り

- 経費カテゴリ1位が経費合計の40%以上: `warning`
- 家計カテゴリ1位が家計支出合計の50%以上: `notice` または `warning`

### 税金目安

`estimatedTax > 0` の場合、税金分の資金を分けて管理する `notice` を出す。

税金計算は学習・概算用であり、正式な申告額ではない。

### データ不足

入力件数が1件以上5件未満の場合、`data_quality` の `notice` を出す。

入力が0件の場合は、改善コメントを生成せず空状態を表示する。

## AI分析JSONとの整合性

`buildAccountingInsights({ entries, month })` の結果を、会計画面とAI分析JSONの両方で使う。

AI分析JSONには `accountingInsights` として含める。

## JSONエクスポートとの整合性

`buildAccountingJson(entries, month)` にも `accountingInsights` を含める。

これにより、会計画面・AI分析JSON・JSONエクスポート用データで同じ改善コメントを扱える。

## 注意

改善コメントは学習・分析・見直し用の概算コメントであり、正式な税務判断や会計判断ではない。

税金計算も概算であり、正式な申告額や納税額を示すものではない。

## 今回できること

- 会計タブで改善コメントを確認する
- severity、指標値、推奨アクション、actionItemsを見る
- 保存済み会計データに応じてコメントを更新する
- AI分析JSONとJSONエクスポート用データに改善コメントを含める

## 今回やらないこと

- AI API連携
- 税務アドバイスの自動生成
- しきい値設定
- 月比較
- 改善アクションの完了管理
- 通知
- グラフライブラリ導入

## 今後の拡張

- しきい値のユーザー設定
- 前月比較
- AI分析履歴との連動
- 改善アクション管理
- 通知
- カテゴリ別の改善推移
