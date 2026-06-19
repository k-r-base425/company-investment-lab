import type { CostBehavior, SpendingJudgement } from "../types/accounting";

const fixedCostCategories = new Set(["家賃", "地代家賃", "通信費", "水道光熱費", "サブスク", "ソフトウェア"]);

const investmentCategories = new Set(["教育・書籍", "研修費", "新聞図書費", "ソフトウェア"]);

const wasteCategories = new Set(["趣味", "美容", "衣服", "交際費", "接待交際費"]);

const necessaryCategories = new Set([
  "家賃",
  "地代家賃",
  "通信費",
  "水道光熱費",
  "食費",
  "日用品",
  "医療費",
  "交通費",
  "支払手数料",
  "租税公課"
]);

export function getDefaultCostBehavior(category: string): CostBehavior {
  return fixedCostCategories.has(category) ? "fixed" : "variable";
}

export function getDefaultSpendingJudgement(category: string): SpendingJudgement {
  if (investmentCategories.has(category)) {
    return "investment";
  }

  if (wasteCategories.has(category)) {
    return "waste";
  }

  if (necessaryCategories.has(category)) {
    return "necessary";
  }

  return "necessary";
}
