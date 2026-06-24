import {
  buildInvestmentAnalysisPayload,
  type InvestmentAnalysisDataSource
} from "../investment/buildInvestmentAnalysisPayload";
import type { InvestmentHolding } from "../types/investment";
import type { YearMonth } from "../types/month";

type BuildInvestmentPromptTextParams = {
  holdings: InvestmentHolding[];
  period: YearMonth;
  monthLabel: string;
  dataSource: InvestmentAnalysisDataSource;
};

export function buildInvestmentPromptText({
  dataSource,
  holdings,
  monthLabel,
  period
}: BuildInvestmentPromptTextParams): string {
  const payload = buildInvestmentAnalysisPayload({
    dataSource,
    holdings,
    period
  });

  return `以下は私の投資管理データです。
対象月は ${monthLabel} です。
目的は、数字を見て投資判断・資産配分判断ができる力を鍛えることです。

注意：

* 株価・指標は手入力またはサンプルです
* 為替換算はまだ未実装です
* 投資判断はこのデータだけで断定せず、複数の情報を確認する前提で分析してください

次の観点で分析してください。

1. 総評価額と評価損益の状態
2. 実保有と仮想保有の違い
3. 現金比率の安全性
4. 資産配分の偏り
5. PER / PBR / ROE / 配当利回りから見た確認ポイント
6. 評価損益が大きい銘柄の確認ポイント
7. 仮想保有銘柄から学べること
8. 次に調べるべき銘柄・指標・財務情報
9. 投資判断を急がず、追加で確認すべき情報

分析結果は後でアプリのAI分析履歴に保存します。
次の形式を意識して回答してください。

1. 重要な気づき
2. 注意すべきリスク
3. 次に調べるべき指標
4. 次に取るべき行動
5. 学習メモとして残すべき用語

データ：
${JSON.stringify(payload, null, 2)}`;
}
