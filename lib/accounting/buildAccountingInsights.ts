import { buildAccountingBreakdowns } from "./buildAccountingBreakdowns";
import { calculateMonthlyAccountingSummary } from "./calculateAccountingSummary";
import type { AccountingEntry } from "../types/accounting";
import type { AccountingInsight, AccountingInsightSeverity } from "../types/accountingInsight";

type BuildAccountingInsightsParams = {
  entries: AccountingEntry[];
  month: string;
};

export function buildAccountingInsights({ entries, month }: BuildAccountingInsightsParams): AccountingInsight[] {
  const summary = calculateMonthlyAccountingSummary(entries, month);
  const breakdowns = buildAccountingBreakdowns(entries, month);
  const insights: AccountingInsight[] = [];

  if (summary.entryCount === 0) {
    return [];
  }

  if (summary.entryCount < 5) {
    insights.push({
      id: "data-quality-entry-count",
      category: "data_quality",
      severity: "notice",
      title: "入力データをもう少し増やしましょう",
      message: "判断材料が少ないため、改善コメントの精度はまだ限定的です。",
      metricLabel: "入力件数",
      metricValue: `${summary.entryCount}件`,
      recommendation: "売上・経費・家計の入力件数を増やし、支出の分類もあわせて整えましょう。",
      actionItems: [
        "売上・経費・家計を最低5件以上入力する",
        "固定費と変動費を分類する",
        "必要支出・浪費・投資を分類する"
      ],
      priority: 45
    });
  }

  if (summary.revenueTotal > 0) {
    insights.push(buildExpenseRatioInsight(summary.expenseRatio));
    insights.push(buildProfitMarginInsight(summary.profit, summary.profitMargin));
  }

  insights.push(buildInvestableAmountInsight(summary.investableAmount));

  const fixed = breakdowns.costBehaviorBreakdown.fixed;
  const variable = breakdowns.costBehaviorBreakdown.variable;
  const costBehaviorTotal = fixed + variable;
  if (costBehaviorTotal > 0) {
    insights.push(buildFixedCostInsight(fixed / costBehaviorTotal, fixed, variable));
  }

  const necessary = breakdowns.judgementBreakdown.necessary;
  const waste = breakdowns.judgementBreakdown.waste;
  const investment = breakdowns.judgementBreakdown.investment;
  const judgedTotal = necessary + waste + investment;
  if (judgedTotal > 0) {
    insights.push(buildWasteInsight(waste / judgedTotal, waste, judgedTotal));
    const investmentRatio = investment / judgedTotal;
    if (investmentRatio < 0.05 || investmentRatio >= 0.15) {
      insights.push(buildInvestmentSpendingInsight(investmentRatio, investment, judgedTotal));
    }
  }

  const topExpenseCategory = breakdowns.expenseCategories[0];
  if (topExpenseCategory && topExpenseCategory.ratio >= 0.4) {
    insights.push({
      id: "expense-category-concentration",
      category: "expense",
      severity: "warning",
      title: "経費が特定カテゴリに偏っています",
      message: `${topExpenseCategory.category} が経費全体の ${formatPercent(topExpenseCategory.ratio)} を占めています。`,
      metricLabel: "最大経費カテゴリ",
      metricValue: topExpenseCategory.category,
      recommendation: "大きいカテゴリの中身を、固定費か一時支出かに分けて確認しましょう。",
      actionItems: [
        "上位カテゴリの明細を確認する",
        "固定費か一時支出かを分ける",
        "来月も続く支出か確認する"
      ],
      relatedData: [
        { label: "金額", value: formatYen(topExpenseCategory.amount) },
        { label: "割合", value: formatPercent(topExpenseCategory.ratio) }
      ],
      priority: 72
    });
  }

  const topHouseholdCategory = breakdowns.householdCategories[0];
  if (topHouseholdCategory && topHouseholdCategory.ratio >= 0.5) {
    const severity: AccountingInsightSeverity = topHouseholdCategory.ratio >= 0.7 ? "warning" : "notice";
    insights.push({
      id: "household-category-concentration",
      category: "household",
      severity,
      title: "家計支出が特定カテゴリに偏っています",
      message: `${topHouseholdCategory.category} が家計支出全体の ${formatPercent(topHouseholdCategory.ratio)} を占めています。`,
      metricLabel: "最大家計カテゴリ",
      metricValue: topHouseholdCategory.category,
      recommendation: "固定化している支出か、今月だけの支出かを分けて見直しましょう。",
      actionItems: [
        "上位カテゴリの中身を確認する",
        "固定費か一時支出かを分ける",
        "来月も続く支出か確認する"
      ],
      relatedData: [
        { label: "金額", value: formatYen(topHouseholdCategory.amount) },
        { label: "割合", value: formatPercent(topHouseholdCategory.ratio) }
      ],
      priority: severity === "warning" ? 71 : 52
    });
  }

  if (summary.estimatedTax > 0) {
    insights.push({
      id: "estimated-tax-reserve",
      category: "tax",
      severity: "notice",
      title: "税金分の資金を分けて管理しましょう",
      message: "利益が出ているため、概算税額を投資可能額とは別枠で考える必要があります。",
      metricLabel: "税金目安",
      metricValue: formatYen(summary.estimatedTax),
      recommendation: "税金は概算として扱い、投資や生活費とは分けて資金管理しましょう。",
      actionItems: [
        "概算税額を別枠で確保する",
        "投資可能額を税引後で考える",
        "正式な申告額ではなく学習用の概算であることを意識する"
      ],
      priority: 48
    });
  }

  return sortInsightsByPriority(insights);
}

function buildExpenseRatioInsight(expenseRatio: number): AccountingInsight {
  if (expenseRatio >= 0.7) {
    return {
      id: "expense-ratio-danger",
      category: "expense",
      severity: "danger",
      title: "経費率がかなり高いです",
      message: "売上に対して経費が大きく、利益を圧迫しています。",
      metricLabel: "経費率",
      metricValue: formatPercent(expenseRatio),
      recommendation: "大きい経費カテゴリから順に、削減できる固定費や不要支出を確認しましょう。",
      actionItems: [
        "経費ランキング上位3カテゴリを確認する",
        "固定費に分類されている支出を見直す",
        "今月中に削減できる支出を1つ決める"
      ],
      priority: 95
    };
  }

  if (expenseRatio >= 0.5) {
    return {
      id: "expense-ratio-warning",
      category: "expense",
      severity: "warning",
      title: "経費率が高めです",
      message: "売上に対して経費負担が大きく、利益が残りにくい状態です。",
      metricLabel: "経費率",
      metricValue: formatPercent(expenseRatio),
      recommendation: "経費カテゴリの上位項目を確認し、継続的な支出から見直しましょう。",
      actionItems: [
        "経費ランキング上位3カテゴリを確認する",
        "継続的に発生している固定費を洗い出す",
        "削減しても事業に影響が小さい支出を探す"
      ],
      priority: 78
    };
  }

  if (expenseRatio <= 0.3) {
    return {
      id: "expense-ratio-good",
      category: "expense",
      severity: "good",
      title: "経費率は良好です",
      message: "売上に対して経費が抑えられており、利益を残しやすい状態です。",
      metricLabel: "経費率",
      metricValue: formatPercent(expenseRatio),
      recommendation: "この水準を維持しながら、投資・学習・事業成長への支出配分を確認しましょう。",
      actionItems: [
        "維持すべき支出管理ルールをメモする",
        "事業成長につながる投資支出の余地を確認する",
        "削りすぎている必要経費がないか確認する"
      ],
      priority: 18
    };
  }

  return {
    id: "expense-ratio-notice",
    category: "expense",
    severity: "notice",
    title: "経費率を定期的に確認しましょう",
    message: "経費率は極端ではありませんが、カテゴリごとの増減を見ておくと判断しやすくなります。",
    metricLabel: "経費率",
    metricValue: formatPercent(expenseRatio),
    recommendation: "経費ランキングを見ながら、来月も続く支出を確認しましょう。",
    actionItems: [
      "経費ランキング上位カテゴリを見る",
      "固定費と変動費を分けて確認する",
      "来月も続く支出をメモする"
    ],
    priority: 42
  };
}

function buildProfitMarginInsight(profit: number, profitMargin: number): AccountingInsight {
  if (profit < 0) {
    return {
      id: "profit-margin-danger",
      category: "profitability",
      severity: "danger",
      title: "利益がマイナスです",
      message: "売上より経費が大きく、事業の収益性に注意が必要です。",
      metricLabel: "利益率",
      metricValue: formatPercent(profitMargin),
      recommendation: "売上単価と経費カテゴリの両方を確認し、赤字要因を分けて見ましょう。",
      actionItems: [
        "売上単価を上げられる案件がないか確認する",
        "経費カテゴリの上位項目を確認する",
        "継続的に発生している固定費を洗い出す"
      ],
      priority: 96
    };
  }

  if (profitMargin < 0.2) {
    return {
      id: "profit-margin-warning",
      category: "profitability",
      severity: "warning",
      title: "利益率が低めです",
      message: "売上はあるものの、経費負担が大きく利益が残りにくい状態です。",
      metricLabel: "利益率",
      metricValue: formatPercent(profitMargin),
      recommendation: "売上単価と固定費を同時に見直し、利益が残る構造を確認しましょう。",
      actionItems: [
        "売上単価を上げられる案件がないか確認する",
        "経費カテゴリの上位項目を確認する",
        "継続的に発生している固定費を洗い出す"
      ],
      priority: 76
    };
  }

  if (profitMargin >= 0.5) {
    return {
      id: "profit-margin-good",
      category: "profitability",
      severity: "good",
      title: "利益率は良好です",
      message: "売上に対して利益がしっかり残っており、収益性は良い状態です。",
      metricLabel: "利益率",
      metricValue: formatPercent(profitMargin),
      recommendation: "利益を税金・生活費・事業予備費・投資にどう配分するか確認しましょう。",
      actionItems: [
        "税金目安を確認する",
        "投資可能額を税引後で見る",
        "学習や事業成長への投資枠を決める"
      ],
      priority: 16
    };
  }

  return {
    id: "profit-margin-notice",
    category: "profitability",
    severity: "notice",
    title: "利益率は中間水準です",
    message: "利益は出ていますが、投資や予備費に回すには継続的な確認が必要です。",
    metricLabel: "利益率",
    metricValue: formatPercent(profitMargin),
    recommendation: "利益率と経費率をセットで見て、無理なく伸ばせるポイントを探しましょう。",
    actionItems: [
      "利益率を月次で確認する",
      "経費率が上がっていないか見る",
      "利益の使い道を税金・生活費・投資に分ける"
    ],
    priority: 41
  };
}

function buildInvestableAmountInsight(investableAmount: number): AccountingInsight {
  if (investableAmount < 0) {
    return {
      id: "investable-amount-danger",
      category: "cashflow",
      severity: "danger",
      title: "投資可能額が不足しています",
      message: "利益から税金・生活費・事業予備費を引くと、投資に回せる余力が不足しています。",
      metricLabel: "投資可能額",
      metricValue: formatYen(investableAmount),
      recommendation: "投資額を増やす前に、現金余力と固定費を確認しましょう。",
      actionItems: [
        "家計支出を確認する",
        "固定費を見直す",
        "投資額を増やす前に現金余力を確保する"
      ],
      priority: 94
    };
  }

  if (investableAmount < 100000) {
    return {
      id: "investable-amount-warning",
      category: "cashflow",
      severity: "warning",
      title: "投資可能額は小さめです",
      message: "投資余力はありますが、税金・生活費・事業予備費を考えると余裕は大きくありません。",
      metricLabel: "投資可能額",
      metricValue: formatYen(investableAmount),
      recommendation: "投資判断の前に、生活費と予備費を確保できているか確認しましょう。",
      actionItems: [
        "生活費入力分を確認する",
        "事業予備費を残せるか確認する",
        "少額から投資計画を作る"
      ],
      priority: 74
    };
  }

  if (investableAmount >= 300000) {
    return {
      id: "investable-amount-good",
      category: "cashflow",
      severity: "good",
      title: "投資可能額に余力があります",
      message: "税金・生活費・事業予備費を考慮しても、投資や学習に回せる余力があります。",
      metricLabel: "投資可能額",
      metricValue: formatYen(investableAmount),
      recommendation: "余力をすべて使い切らず、学習・事業・資産形成に分けて配分しましょう。",
      actionItems: [
        "投資、学習、事業予備費の配分を決める",
        "現金比率を確認する",
        "翌月も同じ余力が出るか確認する"
      ],
      priority: 15
    };
  }

  return {
    id: "investable-amount-notice",
    category: "cashflow",
    severity: "notice",
    title: "投資可能額を慎重に使いましょう",
    message: "一定の投資余力はありますが、現金余力とのバランス確認が必要です。",
    metricLabel: "投資可能額",
    metricValue: formatYen(investableAmount),
    recommendation: "投資判断は税引後・生活費控除後の金額で考えましょう。",
    actionItems: [
      "税金目安を確認する",
      "家計支出を確認する",
      "無理のない投資上限を決める"
    ],
    priority: 43
  };
}

function buildFixedCostInsight(fixedCostRatio: number, fixed: number, variable: number): AccountingInsight {
  const base = {
    category: "fixed_cost" as const,
    metricLabel: "固定費比率",
    metricValue: formatPercent(fixedCostRatio),
    relatedData: [
      { label: "固定費", value: formatYen(fixed) },
      { label: "変動費", value: formatYen(variable) }
    ]
  };

  if (fixedCostRatio >= 0.75) {
    return {
      ...base,
      id: "fixed-cost-danger",
      severity: "danger",
      title: "固定費の割合がかなり高いです",
      message: "固定費の割合が高く、毎月の自由度が下がっています。",
      recommendation: "変動費より先に、毎月続く固定契約や固定支出を見直しましょう。",
      actionItems: [
        "家賃、通信費、サブスク、ソフトウェア費を確認する",
        "使っていない固定契約を1つ解約候補にする",
        "変動費より先に固定費を見直す"
      ],
      priority: 92
    };
  }

  if (fixedCostRatio >= 0.6) {
    return {
      ...base,
      id: "fixed-cost-warning",
      severity: "warning",
      title: "固定費が重めです",
      message: "固定費の割合が高めで、利益や投資可能額に影響しやすい状態です。",
      recommendation: "毎月続く支出を優先して確認しましょう。",
      actionItems: [
        "固定費カテゴリを確認する",
        "使っていない契約を探す",
        "来月も続く支出か確認する"
      ],
      priority: 73
    };
  }

  if (fixedCostRatio <= 0.4) {
    return {
      ...base,
      id: "fixed-cost-good",
      severity: "good",
      title: "固定費比率は抑えられています",
      message: "固定費が抑えられており、毎月の調整余地を残せています。",
      recommendation: "この状態を維持しつつ、必要な投資支出まで削りすぎていないか確認しましょう。",
      actionItems: [
        "固定費の増加予定を確認する",
        "必要な事業ツールまで削りすぎていないか見る",
        "変動費の使い方を確認する"
      ],
      priority: 17
    };
  }

  return {
    ...base,
    id: "fixed-cost-notice",
    severity: "notice",
    title: "固定費比率を確認しましょう",
    message: "固定費は極端ではありませんが、来月以降も続く支出として注意しておきたい項目です。",
    recommendation: "固定費と変動費を分けて、自由に調整できる支出を把握しましょう。",
    actionItems: [
      "固定費カテゴリを確認する",
      "変動費で調整できる支出を見る",
      "来月以降も続く支出をメモする"
    ],
    priority: 42
  };
}

function buildWasteInsight(wasteRatio: number, waste: number, judgedTotal: number): AccountingInsight {
  const base = {
    category: "waste" as const,
    metricLabel: "浪費比率",
    metricValue: formatPercent(wasteRatio),
    relatedData: [
      { label: "浪費", value: formatYen(waste) },
      { label: "判定済み支出", value: formatYen(judgedTotal) }
    ]
  };

  if (wasteRatio >= 0.35) {
    return {
      ...base,
      id: "waste-ratio-danger",
      severity: "danger",
      title: "浪費比率が高いです",
      message: "浪費に分類された支出が大きく、投資可能額を圧迫しています。",
      recommendation: "浪費から学習・事業投資へ振り替えられる金額を探しましょう。",
      actionItems: [
        "浪費に分類された支出を確認する",
        "今月やめられる支出を1つ選ぶ",
        "浪費から学習・事業投資へ振り替えられる金額を決める"
      ],
      priority: 91
    };
  }

  if (wasteRatio >= 0.2) {
    return {
      ...base,
      id: "waste-ratio-warning",
      severity: "warning",
      title: "浪費比率がやや高めです",
      message: "浪費に分類された支出が一定あり、投資可能額に影響しています。",
      recommendation: "すべて削るのではなく、優先度の低い支出から見直しましょう。",
      actionItems: [
        "浪費に分類された支出を確認する",
        "減らせる支出を1つ選ぶ",
        "削減分を投資支出へ回せるか確認する"
      ],
      priority: 72
    };
  }

  if (wasteRatio <= 0.1) {
    return {
      ...base,
      id: "waste-ratio-good",
      severity: "good",
      title: "浪費比率は抑えられています",
      message: "浪費に分類された支出が少なく、支出管理は良い状態です。",
      recommendation: "必要支出と投資支出のバランスを確認し、無理なく継続しましょう。",
      actionItems: [
        "浪費が増えやすいカテゴリを確認する",
        "投資支出へ回せる余力を見る",
        "今の分類ルールを維持する"
      ],
      priority: 14
    };
  }

  return {
    ...base,
    id: "waste-ratio-notice",
    severity: "notice",
    title: "浪費比率を確認しましょう",
    message: "浪費は極端ではありませんが、投資可能額とセットで見ると改善余地が見つかります。",
    recommendation: "浪費に分類した支出を確認し、優先順位をつけましょう。",
    actionItems: [
      "浪費カテゴリを確認する",
      "今月だけの支出か確認する",
      "来月減らす候補を1つ選ぶ"
    ],
    priority: 41
  };
}

function buildInvestmentSpendingInsight(investmentSpendingRatio: number, investment: number, judgedTotal: number): AccountingInsight {
  if (investmentSpendingRatio >= 0.15) {
    return {
      id: "investment-spending-good",
      category: "investment",
      severity: "good",
      title: "投資支出の比率は良好です",
      message: "学習・事業・資産形成につながる支出が一定あり、将来につながる使い方ができています。",
      metricLabel: "投資支出比率",
      metricValue: formatPercent(investmentSpendingRatio),
      recommendation: "投資支出の成果を振り返り、継続するものと見直すものを分けましょう。",
      actionItems: [
        "書籍、研修、ツールの効果を確認する",
        "継続する投資支出を決める",
        "学習テーマと支出を結びつける"
      ],
      relatedData: [
        { label: "投資支出", value: formatYen(investment) },
        { label: "判定済み支出", value: formatYen(judgedTotal) }
      ],
      priority: 13
    };
  }

  return {
    id: "investment-spending-notice",
    category: "investment",
    severity: "notice",
    title: "投資支出が少なめです",
    message: "学習・事業・資産形成につながる支出が少なめです。",
    metricLabel: "投資支出比率",
    metricValue: formatPercent(investmentSpendingRatio),
    recommendation: "浪費支出から、学習や事業投資へ一部を振り替えられるか確認しましょう。",
    actionItems: [
      "書籍、研修、ツール、事業投資に使える予算を決める",
      "浪費支出から投資支出へ一部を振り替える",
      "今月学ぶテーマを1つ決める"
    ],
    relatedData: [
      { label: "投資支出", value: formatYen(investment) },
      { label: "判定済み支出", value: formatYen(judgedTotal) }
    ],
    priority: 44
  };
}

function sortInsightsByPriority(insights: AccountingInsight[]) {
  return [...insights].sort((a, b) => b.priority - a.priority);
}

function formatYen(value: number) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}¥${Math.abs(rounded).toLocaleString("ja-JP")}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
