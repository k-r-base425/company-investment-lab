import type { HomeKpi } from "../types/home";

export const sampleHomeKpis: HomeKpi[] = [
  {
    id: "revenue",
    title: "売上",
    value: "¥2,450,000",
    subtitle: "今月の事業収入",
    icon: "REV",
    tone: "blue",
    trends: [
      { label: "前年比", value: "+12.5%", tone: "positive" },
      { label: "前月比", value: "+8.3%", tone: "positive" }
    ]
  },
  {
    id: "expenses",
    title: "経費",
    value: "¥1,320,000",
    subtitle: "使いすぎ注意",
    icon: "COST",
    tone: "red",
    trends: [
      { label: "前年比", value: "+6.1%", tone: "warning" },
      { label: "前月比", value: "+3.4%", tone: "warning" }
    ]
  },
  {
    id: "profit",
    title: "利益",
    value: "¥1,130,000",
    subtitle: "判断の主役",
    icon: "GAIN",
    tone: "green",
    emphasis: true,
    trends: [
      { label: "前年比", value: "+22.4%", tone: "positive" },
      { label: "前月比", value: "+13.2%", tone: "positive" }
    ]
  },
  {
    id: "estimated-tax",
    title: "税金目安",
    value: "¥282,500",
    subtitle: "概算税率 25%",
    icon: "TAX",
    tone: "purple",
    trends: [{ label: "計算", value: "概算", tone: "neutral" }]
  },
  {
    id: "investable-amount",
    title: "投資可能額",
    value: "¥680,000",
    subtitle: "余力を見える化",
    icon: "PLAN",
    tone: "teal",
    trends: [{ label: "前月比", value: "+9.6%", tone: "positive" }]
  },
  {
    id: "total-assets",
    title: "総資産",
    value: "¥14,850,000",
    subtitle: "現金・投資・事業資金",
    icon: "ASSET",
    tone: "blue",
    trends: [{ label: "前月比", value: "+¥620,000", tone: "positive" }]
  },
  {
    id: "cash-ratio",
    title: "現金比率",
    value: "28.6%",
    subtitle: "安全余力",
    icon: "CASH",
    tone: "teal",
    trends: [{ label: "前月比", value: "+2.3pt", tone: "positive" }]
  },
  {
    id: "investment-gain",
    title: "投資損益",
    value: "+¥1,250,000",
    subtitle: "評価損益 +9.2%",
    icon: "INV",
    tone: "purple",
    trends: [{ label: "評価", value: "含み益", tone: "positive" }]
  },
  {
    id: "learning-progress",
    title: "学習進捗",
    value: "62%",
    subtitle: "Lv.4 / 全10レベル",
    icon: "STUDY",
    tone: "orange",
    trends: [{ label: "今月", value: "継続中", tone: "positive" }]
  }
];
