import type { InvestmentHoldingAnalysisPayload } from "./buildInvestmentHoldingAnalysisPayload";

export function buildInvestmentHoldingPromptText(payload: InvestmentHoldingAnalysisPayload): string {
  const cashGuidance =
    payload.holding.assetType === "cash"
      ? "\n現金データの場合は、銘柄分析ではなく、現金比率・生活防衛資金・投資待機資金としての確認観点を中心に分析してください。\n"
      : "";

  return `以下は私の銘柄別投資分析用データです。
対象月は ${payload.selectedMonthLabel} です。
目的は、1銘柄ずつ数字を見て、投資判断・資産配分判断・財務指標の読み方を学ぶことです。

注意：

* 株価・指標は手入力またはサンプルです
* 為替換算はまだ未実装です
* この分析は学習・検討用です
* 買うべき / 売るべき と断定せず、追加で確認すべき情報を挙げてください
${cashGuidance}
次の観点で分析してください。

1. 銘柄の評価額・評価損益の状態
2. 実保有または仮想保有としての位置づけ
3. ポートフォリオ全体に対する比率
4. PER / PBR / ROE / 配当利回りの確認ポイント
5. 指標から見て注意すべき点
6. この銘柄について追加で調べるべき財務情報
7. 業種平均や競合比較で確認すべきこと
8. 仮想保有の場合、実際に投資を検討する前に確認すべきこと
9. 次に取るべき学習アクション
10. 学習メモとして残すべき用語

回答は以下の形式を意識してください。

* 重要な気づき
* 注意すべきリスク
* 次に調べるべき指標
* 次に取るべき行動
* 学習メモ

データ：
${JSON.stringify(payload, null, 2)}`;
}
