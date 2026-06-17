# 会計投資ラボ / Account Invest Lab

会計、簿記2級、投資指標、家計、経営判断を、自分の実データと疑似データを使って実践的に学ぶためのスマホメインアプリです。

## 概要

Account Invest Labは、日々の売上、経費、家計支出、投資状況、学習進捗を記録し、数字を判断材料に変えるための個人用ラボです。

MVPでは、API連携を行わず、ローカルファーストでデータを管理します。AI分析はアプリ内でAPIを呼ぶのではなく、AI分析用JSONとプロンプトを生成し、ChatGPTなどへコピー&ペーストする方式にします。

## 技術スタック

- Expo
- React Native
- TypeScript
- Expo Router
- SQLite
- CSV出力
- JSON出力

## 開発方針

- スマホメインで設計する
- ローカルファーストで作る
- MVPでは外部API連携を行わない
- 実データ入りCSV、SQLiteファイル、APIキー、個人情報はGitHubにコミットしない
- 会計、家計、投資、学習、AI分析を横断して扱う

## MVP

MVPで作る主な機能:

1. ホームダッシュボード
2. 会計入力
3. 家計簿入力
4. 投資管理
5. 仮想保有銘柄
6. 学習ページ
7. AI分析用データ生成
8. AI分析結果の保存
9. CSV/JSON出力
10. 設定ページ

## セットアップ

このリポジトリはExpo Webアプリとしてビルドできます。

```sh
npm install
npm run build
```

SQLite設計、CSV/JSON出力、追加画面の実装は今後の工程で行います。

## GitHub Pagesでの確認

このプロジェクトはExpo Webとして静的ビルドし、GitHub Pagesで確認できます。

公開URL：

https://k-r-base425.github.io/company-investment-lab/

公開方式：

- GitHub Actionsで `npm run build` を実行
- `dist` フォルダをGitHub Pagesへデプロイ
- GitHub PagesのSourceは GitHub Actions に設定する

注意：

- 実データをコミットしない
- `.env` をコミットしない
- CSV、SQLite DB、個人情報入り画像をコミットしない
- GitHub Pagesは公開URLになるため、表示内容に個人情報を含めない

## 注意事項

- `.env` と `.env.*` はGit管理しません
- 実データ入りCSV、SQLiteファイル、ログ、APIキーはGitHubにコミットしません
- `.env.example` には空のキー名だけを置きます

詳細な仕様は `docs/` を参照してください。
