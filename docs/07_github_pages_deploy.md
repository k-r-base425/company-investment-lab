# GitHub Pages デプロイ手順

## 現在の問題

現在のGitHub Pagesは `Deploy from a branch` / `main` / `root` で公開されているため、Expo WebアプリではなくREADMEのような説明ページが表示される。

## 目標

GitHub ActionsでExpo Webアプリを静的ビルドし、`dist` フォルダをGitHub Pagesへデプロイする。

公開URL:

https://k-r-base425.github.io/company-investment-lab/

## Expo設定

GitHub Pagesのproject siteとして公開するため、`app.json` または `app.config.js` にリポジトリ名をbaseUrlとして設定する。

```json
{
  "expo": {
    "web": {
      "output": "static"
    },
    "experiments": {
      "baseUrl": "/company-investment-lab"
    }
  }
}
```

既存の `name`、`slug`、`scheme`、`plugins` などは維持する。

## ビルド

ローカル確認またはGitHub Actionsでは以下を実行する。

```sh
npm run build
```

`package.json` の `build` スクリプトは以下にする。

```json
{
  "scripts": {
    "build": "expo export --platform web"
  }
}
```

## GitHub Actions workflow

`.github/workflows/deploy-pages.yml` で以下を行う。

- `main` ブランチへのpushで実行
- 手動実行 `workflow_dispatch` に対応
- Node.js 20を使う
- `npm ci` で依存関係を入れる
- `npm run build` でExpo Webを静的ビルドする
- `touch dist/.nojekyll` でJekyll処理を無効化する
- `actions/upload-pages-artifact` で `dist` をアップロードする
- `actions/deploy-pages` でGitHub Pagesへデプロイする

## GitHub側のPages設定

GitHubリポジトリの Settings > Pages で、Sourceを以下に変更する。

```text
GitHub Actions
```

`Deploy from a branch` / `main` / `root` のままだと、READMEが表示され続ける。

## トラブルシュート

### READMEが表示される場合

PagesのSourceが `Deploy from a branch` のままになっている。Settings > Pages でSourceを `GitHub Actions` に変更する。

Sourceが `GitHub Actions` になっていてもREADMEが表示され続ける場合は、以下を確認する。

- 最新の `Deploy Expo Web to GitHub Pages` workflow が成功しているか
- `deploy-check.txt` が公開URLで表示できるか
- `deploy-check.txt` の `sha` が最新commitになっているか
- Actionsログの `Inspect dist` に `dist/index.html` とExpoの静的ファイルが出ているか
- Actionsログの `Verify Expo build output` でREADME由来の文字列が検出されていないか

デプロイ確認ファイル:

https://k-r-base425.github.io/company-investment-lab/deploy-check.txt

`deploy-check.txt` が表示されない場合、GitHub PagesがActions artifactではなく別の公開元を見ている可能性が高い。

### 404になる場合

GitHub Actionsの実行結果が成功しているか確認する。あわせて、Settings > Pages のSourceが `GitHub Actions` になっているか確認する。

### 真っ白になる場合

`app.json` または `app.config.js` の `experiments.baseUrl` が `/company-investment-lab` になっているか確認する。

### CSS/JSが読めない場合

`dist/.nojekyll` が作成されているか確認する。あわせて、`experiments.baseUrl` が `/company-investment-lab` になっているか確認する。

`.nojekyll` はGitHub PagesのJekyll処理を無効化するためのファイル。Expoの出力には `_expo` ディレクトリが含まれるため、Jekyll処理でアセット参照が壊れないようにする。

`actions/upload-pages-artifact` には `include-hidden-files: true` を設定する。これにより、隠しファイルである `dist/.nojekyll` もPages artifactへ含められる。

### dist検証の目的

workflowでは `npm run build` 後に以下を検証する。

- `dist/index.html` が存在すること
- README由来の文字列である `技術スタック` が `dist` に混ざっていないこと
- README末尾の `詳細な仕様は` が `dist` に混ざっていないこと
- Expoアプリ由来の `ダッシュボード` が `dist` に含まれること
- AI分析カード由来の `AI分析` が `dist` に含まれること

これにより、READMEではなくExpo Webアプリのビルド結果がartifact化されているかをActionsログで確認できる。

### 公開URLで確認すべき項目

- `https://k-r-base425.github.io/company-investment-lab/` でホーム画面が表示される
- README本文ではなく `ダッシュボード` が表示される
- 月グラフが表示される
- AI分析カードが表示される
- `https://k-r-base425.github.io/company-investment-lab/deploy-check.txt` が表示される
- `deploy-check.txt` の `sha` が最新commitと一致する

### 実データが表示された場合

即座に該当データを削除する。Git履歴やGitHub Actions artifactに残っていないか確認し、必要に応じて履歴からの削除も検討する。

## 注意

- 実データをコミットしない
- `.env` をコミットしない
- CSV、SQLite DB、個人情報入り画像をコミットしない
- GitHub Pagesは公開URLになるため、表示内容に個人情報を含めない
