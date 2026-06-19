# AI分析履歴保存設計

## 目的

AI分析用プロンプトをコピーした履歴と、ChatGPTなどから返ってきた回答をローカルに保存します。

会計・家計・投資・学習データをAIに渡したあと、分析結果、気づき、次の行動を後から見返せるようにするための機能です。

## プロンプトとAI回答を分けて保存する理由

MVPではAI API連携を行いません。

そのため、アプリ側で保存する情報を以下に分けます。

- `promptText`: ChatGPTなどに貼り付ける分析依頼文
- `payloadJson`: 分析に使ったJSONデータ
- `responseText`: AIから返ってきた回答を手動で貼り付けた内容
- `memo`: 自分用メモ
- `nextAction`: 次に取る行動

プロンプトと回答を分けることで、どのデータをAIに渡し、どんな回答を得たかを後から確認できます。

## 保存方式

Web / GitHub Pagesでは `localStorage` を使います。

localStorage key:

```text
company-investment-lab:ai_analysis_runs:v1
```

ネイティブ実行では、既存のSQLite DBを使います。

DB名:

```text
company_investment_lab.db
```

## ai_analysis_runs テーブル構造

```sql
CREATE TABLE IF NOT EXISTS ai_analysis_runs (
  id TEXT PRIMARY KEY NOT NULL,
  period TEXT NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  status TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  response_text TEXT,
  memo TEXT,
  next_action TEXT,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

インデックス:

```sql
CREATE INDEX IF NOT EXISTS idx_ai_analysis_runs_period
ON ai_analysis_runs(period);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_runs_created_at
ON ai_analysis_runs(created_at);
```

## AiAnalysisRun型

`AiAnalysisRun` は以下を保存対象にします。

- id
- period
- title
- theme
- status
- promptText
- payloadJson
- responseText
- memo
- nextAction
- source
- createdAt
- updatedAt

## ホームAI分析カードから履歴保存する流れ

1. ホーム画面で「分析用データをコピー」を押す
2. 保存済み会計データを読み込む
3. AI分析用payloadを作る
4. 分析依頼文をクリップボードへコピーする
5. コピーしたプロンプトとpayload JSONをAI分析履歴へ保存する
6. 保存済み履歴は学習・AI分析画面で確認できる

## AI回答を手動で保存する流れ

1. ChatGPTなどへプロンプトを貼り付ける
2. 返ってきた回答をコピーする
3. 学習・AI分析画面で対象履歴を選ぶ
4. AI回答、自分用メモ、次の行動を入力する
5. 「分析結果を保存」を押す
6. status が `response_saved` になる

## 今回できること

- AI分析プロンプトコピー時の履歴保存
- AI分析履歴一覧の表示
- AI回答の手動保存
- 自分用メモの保存
- 次の行動の保存
- プロンプト再コピー
- 履歴削除

## 今回やらないこと

- AI API連携
- 自動AI分析
- クラウド同期
- PDF出力
- 履歴検索
- 分析履歴のCSV出力

## 将来拡張

- 検索
- タグ
- CSV/JSON出力
- AI API連携
- 分析履歴とホームKPIの連動
- 複数月比較

## 注意

GitHub Pagesは公開URLです。

実データ、個人情報、APIキー、実CSV、SQLite DBは入力・コミットしないでください。
MVP確認ではサンプルデータのみを使います。
