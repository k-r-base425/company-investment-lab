# ローカル保存設計

## 目的

会計入力画面の売上、経費、家計、仕訳データをローカルに保存し、ページ再読み込み後も最近の入力と月次サマリーを復元できるようにする。

## 保存方式

ネイティブ実行では `expo-sqlite` を使う。

Web / GitHub Pages では `localStorage` fallback を使う。

## WebでSQLiteを直接使わない理由

Expo SQLite のWeb利用では、WASMやSharedArrayBuffer用のHTTPヘッダー設定が必要になる可能性がある。GitHub Pagesではそれらのヘッダー制御が難しいため、WebではSQLiteを直接importせず、`localStorage` で確認できる構成にする。

## テーブル

DB名:

`company_investment_lab.db`

テーブル名:

`accounting_entries`

```sql
CREATE TABLE IF NOT EXISTS accounting_entries (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT,
  payment_method TEXT,
  memo TEXT NOT NULL,
  partner_name TEXT,
  cost_behavior TEXT,
  spending_judgement TEXT,
  debit_account TEXT,
  debit_amount REAL,
  credit_account TEXT,
  credit_amount REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 保存対象

`AccountingEntry` を保存対象にする。`createdAt` と `updatedAt` は保存時に補完する。

## 今回できること

- 初回表示時に保存済みデータを読み込む
- 保存済みデータが空の場合だけサンプルデータをseedする
- 入力追加時にローカル保存する
- 最近の入力リストを保存済みデータから表示する
- 削除ボタンで入力を削除する
- 月次サマリーを保存済みデータから再計算する

## 今回やらないこと

- CSV出力
- 編集機能
- API連携
- 実データ投入
- クラウド同期

## 注意

実データ、CSV、SQLite DB、APIキー、個人情報はGitHubにコミットしない。GitHub Pagesは公開URLになるため、表示内容にも個人情報を含めない。

## 今後の拡張

- 入力編集
- CSV/JSON出力
- ホーム画面のKPIへ保存済みデータを反映
- ローカルバックアップ
- インポート/復元
