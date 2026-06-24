# 投資AI分析履歴連動

## 目的

投資タブで作成したAI分析プロンプトをAI分析履歴に保存し、AIから返ってきた投資分析結果、メモ、次の行動をあとから手動で残せるようにします。

## 投資プロンプトを履歴保存する理由

投資データは手入力またはサンプル値を含みます。プロンプトを履歴に残すことで、どの時点の保有銘柄、評価損益、現金比率、投資指標をもとに分析したかを確認できます。

## 投資AI分析結果を手動保存する流れ

1. 投資タブでAI分析プロンプトをコピー、TXT出力、または「AI分析履歴へ保存」を押します。
2. `AiAnalysisRun` として、プロンプト全文と投資JSON payloadを保存します。
3. 学習・AI分析画面で投資分析履歴を選びます。
4. AI回答、自分用メモ、次の行動を入力して保存します。
5. 保存後は `response_saved` として扱います。

## AiAnalysisRun の拡張

投資分析では以下を使います。

- `theme: investment_review`
- `source: investment_tab`
- `source: investment_export`
- `status: prompt_copied`
- `status: response_saved`

既存の会計AI分析履歴と同じRepositoryに保存し、WebではlocalStorage、ネイティブではSQLiteの既存テーブルを使います。

## 投資タブから履歴保存する流れ

投資タブの投資データ出力カードでは、以下の操作で履歴保存できます。

- AI分析プロンプトをコピー
- AI分析プロンプトをTXT出力
- AI分析履歴へ保存

重複排除は今回実装しません。同じ内容でも作成日時で区別できます。将来、payload hashやaction keyのような仕組みで重複保存を抑制できます。

## 学習・AI分析画面での表示

学習・AI分析画面では、履歴一覧に「投資分析」ラベルを表示します。フィルターで、すべて、会計、投資、回答保存済み、回答未保存を切り替えられます。

## AI分析JSON / JSONエクスポート

AI分析JSONとJSONエクスポートには `aiAnalysisRunsSummary` を含めます。

主な項目:

- `totalCount`
- `accountingCount`
- `investmentCount`
- `responseSavedCount`
- `responsePendingCount`
- `latestInvestmentRunTitle`
- `latestInvestmentRunAt`

投資JSONにも同じサマリーを含められるようにし、投資分析履歴の状況を確認できるようにします。

## 注意

AI分析は学習・検討用です。投資判断を断定するものではありません。株価や投資指標は手入力またはサンプル値であり、投資判断には複数の情報を確認してください。

## 今回できること

- 投資AI分析プロンプトをAI分析履歴へ保存
- コピー時の履歴保存
- TXT出力時の履歴保存
- 投資AI分析結果、メモ、次の行動の手動保存
- 投資プロンプトの再コピー
- 投資分析履歴のラベル表示
- `aiAnalysisRunsSummary` の出力

## 今回やらないこと

- AI API連携
- 株価API連携
- 証券口座API連携
- 銘柄別AI分析画面
- 厳密な重複保存防止
- 投資判断の自動判定

## 将来拡張

- 投資履歴との紐づけ
- 銘柄別AI分析
- AI API連携
- 分析タグ
- 重複保存防止
- 検索
