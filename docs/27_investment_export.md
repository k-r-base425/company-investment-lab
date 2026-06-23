# 投資データ出力

## 目的

投資タブで保存した保有銘柄データを、CSV、JSON、AI分析プロンプトとして出力できるようにします。株価APIや証券口座APIには接続せず、ローカル保存された手入力データまたはサンプルデータを使います。

## CSV出力の用途

`investment_holdings_YYYY-MM.csv` として、保有銘柄の一覧を表形式で確認できます。表計算ソフトでの確認や、別ツールへ移す前の下書きとして使います。

CSVヘッダー:

```text
id,name,ticker,assetType,positionType,quantity,averageCost,currentPrice,acquisitionAmount,marketValue,gainLoss,gainLossRate,dividendYield,per,pbr,roe,memo,createdAt,updatedAt
```

`acquisitionAmount`、`marketValue`、`gainLoss`、`gainLossRate` は出力時に計算します。カンマ、改行、ダブルクォートを含む値はCSVエスケープします。

## JSON出力の用途

`investment_analysis_YYYY-MM.json` として、投資分析に使いやすい構造を出力します。

主な構造:

- `period`
- `snapshotMonth`
- `exportedAt`
- `dataSource`
- `summary`
- `allocation`
- `holdings`
- `indicatorNotes`
- `assumptions`

`holdings` には保有銘柄の元データに加えて、取得金額、評価額、評価損益、評価損益率を含めます。

## AI分析プロンプト出力の用途

`investment_ai_prompt_YYYY-MM.txt` として、ChatGPTなどに貼り付ける文章とJSONデータを出力します。投資タブから同じ内容をクリップボードへコピーすることもできます。

## Web / Native

Web / GitHub Pagesでは、Blobとdownload属性によるブラウザダウンロードを使います。Web用ファイルから `expo-file-system` や `expo-sharing` は直接importしません。

ネイティブでは `exportFiles.native.ts` に `expo-file-system` の書き出し処理を閉じ込め、共有はReact Native標準の `Share` を使います。`expo-sharing` は今回の依存関係に追加していません。

## 投資データの保存元

保存済みデータは `getInvestmentHoldings()` から取得します。保存済みデータが空の場合だけ、出力用fallbackとして `sampleInvestmentHoldings` を使います。出力機能側でサンプルデータを保存し直すことはしません。

## 投資指標の扱い

PER、PBR、ROE、配当利回りは手入力またはサンプル値です。単独で投資判断を断定せず、業種、成長性、財務状態と合わせて確認する前提で扱います。

## 今回できること

- 投資CSV出力
- 投資JSON出力
- 投資AI分析プロンプトTXT出力
- 投資AI分析プロンプトのクリップボードコピー
- 保存済み投資データが空の場合のサンプルfallback

## 今回やらないこと

- 投資CSVインポート
- 売買履歴
- 投資履歴管理
- 株価API
- 証券口座API
- 為替換算

## 将来拡張

- 投資CSVインポート
- 売買履歴
- 投資履歴
- 株価API
- 為替換算
- 証券口座API
- AI分析履歴との連動
