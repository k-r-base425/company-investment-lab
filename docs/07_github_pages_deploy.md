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

### 404になる場合

GitHub Actionsの実行結果が成功しているか確認する。あわせて、Settings > Pages のSourceが `GitHub Actions` になっているか確認する。

### 真っ白になる場合

`app.json` または `app.config.js` の `experiments.baseUrl` が `/company-investment-lab` になっているか確認する。

### CSS/JSが読めない場合

`dist/.nojekyll` が作成されているか確認する。あわせて、`experiments.baseUrl` が `/company-investment-lab` になっているか確認する。

### 実データが表示された場合

即座に該当データを削除する。Git履歴やGitHub Actions artifactに残っていないか確認し、必要に応じて履歴からの削除も検討する。

## 注意

- 実データをコミットしない
- `.env` をコミットしない
- CSV、SQLite DB、個人情報入り画像をコミットしない
- GitHub Pagesは公開URLになるため、表示内容に個人情報を含めない
