import type { AiAnalysisPayload } from "../types/ai";

export function buildAiAnalysisPrompt(payload: AiAnalysisPayload) {
  return `以下は私の会計・家計・投資・学習データです。
目的は、数字を見て投資・経営判断ができる力を鍛えることです。

次の観点で分析してください。

1. 事業の収益性
2. 経費率の問題点
3. 投資可能額の妥当性
4. 家計支出の改善ポイント
5. 現金比率の安全性
6. 投資ポートフォリオの偏り
7. 今月見るべき会計・投資指標
8. 簿記2級の学習と結びつくポイント
9. 次に取るべき具体的な行動

データ：
${JSON.stringify(payload, null, 2)}`;
}
