# AI分析設計

## AI分析機能の目的

AI分析機能は、会計、家計、投資、学習のデータを構造化し、ChatGPTなどに貼り付けて分析しやすくするための機能。

MVPではアプリ内からAI APIを呼び出さない。アプリは、AIに渡すJSONとプロンプトを生成し、ユーザーがコピー&ペーストで外部AIに渡す。

## AIに渡すJSON構造

以下は基本構造の案。

```json
{
  "app_name": "Account Invest Lab",
  "analysis_theme": "business_investment_household_summary",
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "summary": {
    "revenue": 0,
    "expense": 0,
    "profit": 0,
    "estimated_tax": 0,
    "investable_amount": 0,
    "total_assets": 0,
    "cash_ratio": 0,
    "investment_gain_loss": 0
  },
  "accounting": {
    "transactions_count": 0,
    "revenue_by_category": [],
    "expense_by_category": [],
    "monthly_trend": []
  },
  "household": {
    "transactions_count": 0,
    "income_total": 0,
    "expense_total": 0,
    "expense_by_category": [],
    "daily_expenses": []
  },
  "investments": {
    "real_assets": [],
    "virtual_assets": [],
    "allocation": [],
    "performance_summary": {}
  },
  "learning": {
    "progress_rate": 0,
    "recent_topics": [],
    "next_review_topics": []
  },
  "notes": {
    "user_question": "",
    "constraints": [
      "MVP data is manually entered",
      "tax values are rough estimates",
      "do not treat this as investment advice"
    ]
  }
}
```

## AIに渡すプロンプトテンプレート

```text
あなたは会計、家計管理、投資分析、経営判断の学習を支援するアシスタントです。

以下のJSONは、私の会計、家計、投資、学習データをAI分析用に整理したものです。
税金は概算であり、投資データは手入力です。
投資助言や売買推奨ではなく、数字の読み方、改善点、確認すべき論点、学習ポイントを教えてください。

分析してほしいテーマ:
{{analysis_theme}}

重視してほしい観点:
- 売上、経費、利益の変化
- 税金目安と資金繰り
- 家計支出の傾向
- 投資可能額と現金比率
- 実保有資産と仮想保有銘柄の違い
- 簿記、会計、投資指標の学習ポイント
- 次に取るべき確認アクション

出力形式:
1. 要約
2. 良い点
3. 注意点
4. 数字から見える仮説
5. 追加で記録した方がよいデータ
6. 今日または今週のアクション
7. 学習すべきテーマ

JSON:
{{analysis_json}}
```

## 分析履歴として保存する項目

- 分析ID
- 分析テーマ
- 対象期間
- 対象データ範囲
- 生成したJSON
- 生成したプロンプト
- AIから返ってきた回答
- ユーザーのメモ
- 作成日時
- 更新日時

AIの回答は全文保存できる設計にする。あとから改善提案、判断メモ、学習メモとして見返すため。

## 分析テーマ一覧

- 総合分析
- 事業の収益性分析
- 家計支出分析
- 投資ポートフォリオ分析
- 仮想保有銘柄の検証
- キャッシュフロー分析
- 税金目安と資金繰り確認
- 投資可能額の確認
- 学習進捗と弱点分析
- 疑似株式会社モードの経営判断分析

## MVPではAI APIを使わず、コピー&ペースト方式にする理由

- APIキーをアプリやGitHubに入れるリスクを避けるため
- 個人の実データを外部APIへ自動送信しないため
- MVPでは、まずAIに渡すデータ構造とプロンプト品質を検証するため
- 利用料金やAPI制限を気にせず試せるようにするため
- ユーザーが送信前に内容を確認し、必要に応じて個人情報を削除できるようにするため

将来、AI API連携を追加する場合も、送信前プレビュー、個人情報確認、APIキー管理、送信履歴の保存を必須にする。
