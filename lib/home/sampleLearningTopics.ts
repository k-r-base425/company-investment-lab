import type { LearningTopic } from "../types/learning";

export const sampleLearningTopics: LearningTopic[] = [
  {
    id: "per-pbr-roe",
    title: "PER / PBR / ROE",
    category: "投資指標",
    description: "株価指標の基本と使い方を学びます。",
    estimatedMinutes: 15,
    difficultyLabel: "Lv.4 推奨",
    progressRate: 0.75,
    recommendationReason: "投資損益と資産配分を見直す前に、企業価値の見方を確認しましょう。",
    accentTone: "green"
  },
  {
    id: "depreciation",
    title: "簿記2級：固定資産と減価償却",
    category: "商業簿記",
    description: "固定資産の取得、減価償却、決算整理を学びます。",
    estimatedMinutes: 20,
    difficultyLabel: "Lv.4 推奨",
    progressRate: 0.6,
    recommendationReason: "事業用資産や設備投資を判断するための基礎になります。",
    accentTone: "blue"
  },
  {
    id: "profit-cashflow",
    title: "利益とキャッシュフローの違い",
    category: "財務分析",
    description: "利益が出ていても現金が不足する理由を学びます。",
    estimatedMinutes: 12,
    difficultyLabel: "Lv.3 推奨",
    progressRate: 0.4,
    recommendationReason: "投資可能額と現金比率を正しく判断するために重要です。",
    accentTone: "orange"
  }
];
