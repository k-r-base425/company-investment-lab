# 会計カテゴリ分析

## 目的

会計入力データをカテゴリ別に集計し、売上・経費・家計支出の偏り、固定費と変動費のバランス、必要支出・浪費・投資の比率を確認できるようにする。

## 対象月

- 対象月: `2026-06`
- 表示: 2026年6月

## 表示する分析

### 売上カテゴリ別内訳

`type === "revenue"` の入力をカテゴリ別に集計する。

- 金額合計
- 件数
- 売上合計に対する割合

### 経費カテゴリ別ランキング

`type === "expense"` の入力をカテゴリ別に集計し、金額が大きい順に表示する。

- 金額合計
- 件数
- 経費合計に対する割合
- 会計画面では上位5件を表示

### 家計カテゴリ別ランキング

`type === "household"` の入力をカテゴリ別に集計し、金額が大きい順に表示する。

- 金額合計
- 件数
- 家計支出合計に対する割合
- 会計画面では上位5件を表示

### 固定費 / 変動費

`type === "expense"` または `type === "household"` の入力を対象にする。

- `costBehavior === "fixed"` は固定費
- `costBehavior === "variable"` は変動費
- 未設定の場合は変動費として扱う

### 必要支出 / 浪費 / 投資

`type === "expense"` または `type === "household"` の入力を対象にする。

- `spendingJudgement === "necessary"` は必要支出
- `spendingJudgement === "waste"` は浪費
- `spendingJudgement === "investment"` は投資
- 未設定の場合は必要支出として扱う

## 集計ロジック

カテゴリ分析は `buildAccountingBreakdowns(entries, month)` に集約する。

この関数は以下を返す。

- 売上カテゴリ別内訳
- 経費カテゴリ別ランキング
- 家計カテゴリ別ランキング
- 固定費 / 変動費の合計
- 必要支出 / 浪費 / 投資の合計

仕訳入力はカテゴリ分析の対象外とする。ただし、会計画面の件数表示では月内入力件数として扱う。

## AI分析JSONとの整合性

AI分析JSONの `accountingAnalysis.categoryBreakdown`、`judgementBreakdown`、`costBehaviorBreakdown` は、会計タブのカテゴリ分析と同じ `buildAccountingBreakdowns` を使って生成する。

これにより、会計画面で見えているカテゴリ分析と、ChatGPTなどへ渡すAI分析用JSONの内容が一致する。

## JSONエクスポートとの整合性

JSONエクスポート用の土台として `buildAccountingJson(entries, month)` を用意する。

この関数は月次サマリーと `buildAccountingBreakdowns` の結果を同じJSONにまとめる。将来のJSON出力画面では、この関数を使うことでカテゴリ分析と同じ集計値を出力できる。

## 保存方式

- Web / GitHub Pages: `localStorage` fallback 経由で保存済み会計入力を読む
- ネイティブ実行: SQLite Repository 経由で保存済み会計入力を読む

Web用ファイルから `expo-sqlite` を直接importしない方針は維持する。

## 今回できること

- 会計タブでカテゴリ分析を確認する
- 売上、経費、家計カテゴリの内訳を見る
- 経費と家計の上位カテゴリを見る
- 固定費 / 変動費の内訳を見る
- 必要支出 / 浪費 / 投資の内訳を見る
- AI分析JSONとJSONエクスポート用データで同じカテゴリ集計を使う

## 今回やらないこと

- カテゴリ編集
- 予算管理
- 月比較
- グラフライブラリ導入
- API連携
- CSV出力画面の追加

## 今後の拡張

- カテゴリの追加・編集
- カテゴリ別推移
- 月別比較
- 予算との差分管理
- ホームKPIや月グラフとのカテゴリ連動
- AI分析履歴とのカテゴリ別改善アクション連動

## 注意

GitHub Pagesは公開URLで確認するため、実データや個人情報は入力しない。実CSV、SQLite DB、`.env`、APIキー、個人情報入り画像はGitにコミットしない。
