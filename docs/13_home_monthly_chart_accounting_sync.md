# ホーム月グラフ会計データ連動

## 目的

ホーム画面の月グラフを固定サンプルではなく、保存済み会計入力データから日別に生成する。

売上、経費、利益、家計支出の動きを毎日確認し、AI分析JSONにも同じ日別データを渡せるようにする。

## 対象月

- 対象月：2026-06
- 画面表示：2026年6月
- MVPでは月選択は行わない

## 指標切り替え

月グラフでは以下の4指標を切り替える。

- 売上：`type === "revenue"` の日別合計
- 経費：`type === "expense"` の日別合計
- 利益：日別売上合計 - 日別経費合計
- 家計：`type === "household"` の日別合計

初期表示は利益とする。

## 日別集計ロジック

`buildMonthlyChartFromAccountingEntries` で、会計入力データから `MonthlyChartData` を生成する。

- 2026年6月は1日〜30日を必ず作る
- 未入力日も削除しない
- 未入力日は `value: null`, `status: "empty"` にする
- 入力済み日は対象指標の値を `value` に入れる
- profitでは売上または経費がある日を入力済み扱いにする

各日には以下を保持する。

- `date`
- `day`
- `value`
- `status`
- `revenueTotal`
- `expenseTotal`
- `householdTotal`
- `profit`
- `entryCount`

## high / middle / low / empty

入力済み日だけを対象に、対象指標の値で降順に並べる。

- 1件だけなら high
- 2件なら high / low
- 3件以上なら上位33%を high、下位33%を low、残りを middle
- `value === null` は empty

経費と家計では、highを注意色として扱う。

## 未入力日を表示する理由

未入力日も表示することで、記録漏れや入力習慣の途切れを見つけやすくする。

AI分析に渡すJSONでも未入力日を残し、入力されていない日と金額0の日を区別できるようにする。

## 選択中の日付詳細

月グラフの棒をタップすると、その日を選択する。

選択中の日付には以下を表示する。

- 日付
- 選択中指標の値
- 売上
- 経費
- 利益
- 家計
- 入力件数

未入力日は「未入力日です」と表示する。

## AI分析JSONとの整合性

ホーム表示とAI分析JSONの `monthlyChart` は同じ `buildMonthlyChartFromAccountingEntries` を使う。

AI分析コピーでは、保存済み会計入力データから profit 指標の日別グラフを生成する。

`monthlyChart.days` は1日〜月末までの日別データで、未入力日は `value: null`, `status: "empty"` とする。

## 保存方式

- Web / GitHub Pages：`localStorage` fallback経由のRepositoryから会計入力データを読む
- ネイティブ：SQLite経由のRepositoryから会計入力データを読む

Web用ファイルから `expo-sqlite` を直接importしない方針は維持する。

## 今回できること

- ホーム月グラフを保存済み会計データに連動
- 売上 / 経費 / 利益 / 家計の指標切り替え
- 選択日の詳細表示
- AI分析JSONの `monthlyChart` への同一日別データ反映

## 今回やらないこと

- 月選択
- 前月比較
- 投資グラフ連動
- 資産配分カードの保存データ連動
- API連携

## 将来拡張

- 月選択
- 前月比較
- カテゴリ別日別グラフ
- ホームKPIとの完全同期
- 投資グラフ連動
