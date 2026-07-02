# 学習メモ保存

## 目的

学習テーマごとに、気づき、復習ポイント、AI分析結果から残したい内容を保存できるようにする。

## 学習進捗との違い

学習進捗は、未着手、学習中、完了といった状態を管理する。学習メモは、テーマごとの自由記述として、何を理解したか、次に何を確認するかを残す。

## 保存方式

Web / GitHub Pagesでは `localStorage` を使う。

キー:

`company-investment-lab:learning_memos:v1`

ネイティブでは既存SQLite DB `company_investment_lab.db` に `learning_memos` テーブルを作る。

## テーブル構造

`learning_memos`

- `id`
- `topic_id`
- `topic_title`
- `category`
- `title`
- `body`
- `source`
- `source_ai_analysis_run_id`
- `source_ai_analysis_run_title`
- `related_screen`
- `created_at`
- `updated_at`

## 手動メモ

学習カードごとにメモを追加できる。

- タイトル
- 本文
- source: `manual`
- 関連画面
- 作成日時
- 更新日時

保存後はカード内のメモ一覧に表示する。編集と削除も同じカードから行う。

## AI分析履歴からのメモ化

AI分析履歴で履歴を選択すると「学習メモに保存」できる。AI回答、自分用メモ、次の行動があれば本文に含める。まだ回答がない場合はプロンプト冒頭を保存する。

テーマは `theme` から推定する。

- 月次レビュー: 利益とキャッシュフロー
- 収益性レビュー: 経費率と利益率
- 家計レビュー: 税金目安と投資可能額
- 投資レビュー: PER / PBR / ROE
- 銘柄分析: 銘柄別AI分析
- その他: AI分析結果の見返し

## 学習ダッシュボード

学習ダッシュボードに最近の学習メモを表示する。

- メモ総数
- 最近のメモ3件
- カテゴリ
- タイトル
- 作成日

## ホーム連動

ホームの今日の学習カードに最新メモを控えめに表示する。ホームの主要KPIや投資カードは変更しない。

## AI分析JSON

ホームAI分析JSONに `learningMemos` を含める。

- `totalCount`
- `accountingMemoCount`
- `investmentMemoCount`
- `aiAnalysisMemoCount`
- `latestMemos`

AI分析プロンプトにも、保存済み学習メモを今月の数字理解や次の復習ポイントに使う観点を追加する。

## 今回できること

- 学習テーマごとにメモを追加できる
- メモを編集、削除できる
- AI分析履歴から学習メモを作れる
- 学習ダッシュボードで最近のメモを確認できる
- ホームの今日の学習カードに最新メモを表示できる
- AI分析JSONに学習メモサマリーを含められる

## 今回やらないこと

- 学習メモ検索
- タグ機能
- 学習メモのCSV / JSON出力
- クイズ
- 簿記2級の本格演習
- AI API連携

## 将来拡張

- タグ
- 検索
- 学習メモのエクスポート
- クイズ連動
- 簿記2級演習
- AI要約
