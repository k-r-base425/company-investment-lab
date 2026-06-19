export type LearningCategory =
  | "投資指標"
  | "商業簿記"
  | "工業簿記"
  | "財務分析"
  | "税金"
  | "経営判断";

export type LearningTopic = {
  id: string;
  title: string;
  category: LearningCategory;
  description: string;
  estimatedMinutes: number;
  difficultyLabel: string;
  progressRate: number;
  recommendationReason: string;
  accentTone: "blue" | "green" | "purple" | "orange" | "teal";
};
