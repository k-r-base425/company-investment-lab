# データ設計

## 基本方針

- SQLiteをローカルDBとして使う
- ローカルファーストで設計する
- MVPではAPI連携を行わない
- 実データ入りCSV、SQLiteファイル、APIキー、個人情報はGitHubにコミットしない
- サンプルデータと実データを明確に分ける

## 主要データモデル

### accounting_transactions

事業、副業、疑似株式会社モードの会計取引を保存する。

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | string | 取引ID |
| date | string | 取引日 |
| mode | string | personal_business / side_business / virtual_company |
| type | string | revenue / expense / transfer / adjustment |
| account_category | string | 勘定科目 |
| amount | number | 金額 |
| tax_hint | number | 税金目安用の概算額 |
| payment_method | string | 現金、カード、銀行など |
| description | string | 内容 |
| memo | string | メモ |
| tags | string[] | タグ |
| created_at | string | 作成日時 |
| updated_at | string | 更新日時 |

### household_transactions

毎日の家計収支を保存する。

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | string | 取引ID |
| date | string | 取引日 |
| type | string | income / expense / transfer |
| category | string | 家計カテゴリ |
| amount | number | 金額 |
| payment_method | string | 支払方法 |
| store_name | string | 店舗名 |
| description | string | 内容 |
| memo | string | メモ |
| tags | string[] | タグ |
| is_business_related | boolean | 事業関連かどうか |
| created_at | string | 作成日時 |
| updated_at | string | 更新日時 |

### journal_entries

簿記学習や疑似株式会社モードで使う仕訳データを保存する。

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | string | 仕訳ID |
| date | string | 仕訳日 |
| source_transaction_id | string | 元取引ID |
| debit_account | string | 借方科目 |
| debit_amount | number | 借方金額 |
| credit_account | string | 貸方科目 |
| credit_amount | number | 貸方金額 |
| memo | string | メモ |
| is_practice | boolean | 学習用、疑似用かどうか |
| created_at | string | 作成日時 |
| updated_at | string | 更新日時 |

### investment_assets

実保有の投資資産を保存する。

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | string | 資産ID |
| asset_type | string | stock / fund / etf / cash / crypto / other |
| name | string | 銘柄名、資産名 |
| ticker | string | ティッカー |
| account_type | string | 特定、NISA、現金など |
| quantity | number | 数量 |
| average_cost | number | 平均取得単価 |
| current_price | number | 現在価格 |
| market_value | number | 評価額 |
| unrealized_gain_loss | number | 含み損益 |
| memo | string | メモ |
| updated_price_at | string | 価格更新日時 |
| created_at | string | 作成日時 |
| updated_at | string | 更新日時 |

### virtual_investments

仮想保有銘柄を保存する。投資判断の練習や比較に使う。

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | string | 仮想投資ID |
| asset_type | string | stock / fund / etf / crypto / other |
| name | string | 銘柄名、資産名 |
| ticker | string | ティッカー |
| virtual_buy_date | string | 仮想購入日 |
| virtual_quantity | number | 仮想数量 |
| virtual_buy_price | number | 仮想購入価格 |
| current_price | number | 現在価格 |
| virtual_market_value | number | 仮想評価額 |
| virtual_gain_loss | number | 仮想損益 |
| investment_thesis | string | 投資仮説 |
| review_memo | string | 検証メモ |
| created_at | string | 作成日時 |
| updated_at | string | 更新日時 |

### learning_topics

学習テーマと進捗を保存する。

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | string | 学習テーマID |
| category | string | bookkeeping / accounting / investing / household / management |
| title | string | テーマ名 |
| status | string | not_started / learning / review / completed |
| progress_rate | number | 進捗率 |
| confidence_level | number | 理解度 |
| last_studied_at | string | 最終学習日 |
| next_review_at | string | 次回復習日 |
| memo | string | 学習メモ |
| created_at | string | 作成日時 |
| updated_at | string | 更新日時 |

### ai_analysis_runs

AI分析用データ生成と、AI分析結果を保存する。

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | string | 分析ID |
| theme | string | 分析テーマ |
| period_start | string | 対象期間開始 |
| period_end | string | 対象期間終了 |
| data_scope | string[] | accounting / household / investment / virtual_investment / learning |
| generated_json | string | AIに渡したJSON |
| prompt_text | string | AIに渡したプロンプト |
| ai_response | string | AIの分析結果 |
| user_memo | string | ユーザーメモ |
| created_at | string | 作成日時 |
| updated_at | string | 更新日時 |

### app_settings

アプリ全体の設定を保存する。

| カラム | 型 | 説明 |
| --- | --- | --- |
| id | string | 設定ID |
| key | string | 設定キー |
| value | string | 設定値 |
| value_type | string | string / number / boolean / json |
| description | string | 説明 |
| created_at | string | 作成日時 |
| updated_at | string | 更新日時 |

## CSV/JSON出力対象

- accounting_transactions
- household_transactions
- journal_entries
- investment_assets
- virtual_investments
- learning_topics
- ai_analysis_runs
- 月次サマリー
- AI分析用集約データ

## GitHubにコミットしてはいけない実データ

- 実データ入りCSV
- 実データ入りTSV
- SQLiteファイル
- データベースのバックアップファイル
- APIキー
- `.env` と `.env.*`
- 個人名、住所、電話番号、メールアドレス
- 銀行口座、証券口座、クレジットカードに関する情報
- 実店舗名や取引先名を含む明細データ
- ChatGPTなどへ渡した個人情報入りプロンプト

サンプルデータを置く場合は、`data/sample` などの専用ディレクトリに、架空の人物、架空の取引、架空の銘柄、架空の金額だけを保存する。
