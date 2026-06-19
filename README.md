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

## ローカル保存

会計入力データはローカル保存されます。

- ネイティブ実行ではSQLiteを使います
- Web / GitHub Pages確認では`localStorage` fallbackを使います
- 会計入力データは追加、編集、削除できます
- ホーム画面のAI分析コピーには保存済み会計データが反映されます
- AI分析プロンプトをコピーした履歴を保存できます
- AIから返ってきた回答は手動で貼り付けて保存できます
- GitHub Pages確認では`localStorage`上のサンプルデータを使います
- ネイティブ実行ではAI分析履歴もSQLite保存の土台を使います
- ブラウザの`localStorage`を消すと、Web確認用の保存データは消えます
- MVP確認では実データや個人情報を入れず、サンプルデータだけを使ってください

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

## GitHub Pagesデプロイ確認

公開URL：

https://k-r-base425.github.io/company-investment-lab/

デプロイ確認ファイル：

https://k-r-base425.github.io/company-investment-lab/deploy-check.txt

確認方法：

1. GitHub Actionsの Deploy Expo Web to GitHub Pages が成功しているか確認する
2. deploy-check.txt が表示されるか確認する
3. deploy-check.txt に最新のcommit shaが出ているか確認する
4. 公開URLでREADMEではなくアプリ画面が表示されるか確認する

READMEが表示される場合：

- GitHub Pages Source が GitHub Actions になっているか確認
- workflowを手動再実行する
- distにREADME本文が混ざっていないかActionsログで確認する
- deploy-check.txt が表示されるか確認する

## 注意事項

- `.env` と `.env.*` はGit管理しません
- 実データ入りCSV、SQLiteファイル、ログ、APIキーはGitHubにコミットしません
- `.env.example` には空のキー名だけを置きます

詳細な仕様は `docs/` を参照してください。
