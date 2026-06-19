import type { LearningTopic } from "../types/learning";

export const sampleLearningTopics: LearningTopic[] = [
  {
    id: "per-pbr-roe",
    title: "PER / PBR / ROE",
    category: "investment_indicator",
    categoryLabel: "投資指標",
    estimatedMinutes: 15,
    progressRate: 0.75,
    description: "株価指標の基本と使い方を学ぶ",
    reason: "投資判断の基礎になるため",
    tone: "green"
  },
  {
    id: "depreciation",
    title: "簿記2級：固定資産と減価償却",
    category: "bookkeeping",
    categoryLabel: "商業簿記",
    estimatedMinutes: 20,
    progressRate: 0.6,
    description: "固定資産の取得・減価償却・売却を理解する",
    reason: "事業資産の管理に関係するため",
    tone: "blue"
  },
  {
    id: "profit-cashflow",
    title: "利益とキャッシュフローの違い",
    category: "financial_statement",
    categoryLabel: "財務諸表",
    estimatedMinutes: 12,
    progressRate: 0.4,
    description: "利益が出ていても現金が減る理由を学ぶ",
    reason: "経営判断で重要なため",
    tone: "orange"
  },
  {
    id: "expense-profit-margin",
    title: "経費率と利益率",
    category: "management",
    categoryLabel: "経営判断",
    estimatedMinutes: 10,
    progressRate: 0.3,
    description: "売上に対して経費と利益がどれくらいあるかを見る",
    reason: "今月の事業判断に使えるため",
    tone: "teal"
  }
];
