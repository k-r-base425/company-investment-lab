# 対象月選択の土台

## 目的

これまで多くの画面と出力で `2026-06` を固定利用していました。
対象月を `selectedMonth` として共通管理し、ホーム、会計、AI分析、JSON出力が同じ月を参照できるようにします。

## selectedMonth の形式

内部値は `YYYY-MM` 形式です。

例：

- `2026-06`
- `2026-07`
- `2025-12`

表示は `2026年6月` の形式にします。

## 初期値とサンプル月

初期値は `2026-06` です。

`2026-06` はサンプル月として扱います。

## MonthSelector

ホーム画面と会計画面に対象月選択UIを表示します。

- 前月ボタン
- 選択中の月
- 次月ボタン
- サンプル月へ戻るボタン

年またぎも通常の月移動として扱います。

## selectedMonth を使う対象

- ホームKPI
- ホーム月グラフ
- 会計入力サマリー
- カテゴリ分析
- 改善コメント
- 改善アクション
- 改善効果トラッキング
- AI分析JSON
- AI分析履歴
- JSONエクスポート用データ

## sampleAccountingEntries の扱い

`sampleAccountingEntries` は `2026-06` のサンプルデータです。

- `2026-06` で保存済みデータがない場合：表示用にサンプルデータを使う
- `2026-06` 以外で保存済みデータがない場合：空データとして表示する

サンプルデータを他の月へ自動コピーしません。

## AI分析JSONとの整合性

AI分析コピーでは、選択中の月を `period` に入れます。

以下も選択月に揃えます。

- `monthlyChart.month`
- `accountingAnalysis.month`
- `improvementActions.period`
- `improvementProgress.period`

AI分析履歴のタイトルにも選択月ラベルを入れます。

## JSONエクスポートとの整合性

`buildAccountingJson(entries, selectedMonth, actions)` の `month` は選択月です。

将来のファイル名は以下の形式に寄せます。

- `accounting_entries_2026-06.csv`
- `accounting_analysis_2026-06.json`
- `ai_analysis_prompt_2026-06.txt`

## 今回できること

- ホームと会計で対象月を切り替える
- 選択月に応じて主要集計を再計算する
- Webでは選択月を `localStorage` に保存する
- サンプル月以外では空データ表示にする

## 今回やらないこと

- 前月比
- 月比較
- 年度切り替え
- 予算管理
- 月別一覧

## 将来拡張

- 前月比
- 月比較
- 年度切り替え
- 予算
- 月別データ一覧
- 投資データの月別管理
