import { investmentIndicatorTopics } from "./investmentIndicatorTopics";
import type { InvestmentHolding } from "../types/investment";
import type {
  InvestmentIndicatorInsight,
  InvestmentIndicatorKey,
  InvestmentIndicatorReport,
  InvestmentIndicatorTone
} from "../types/investmentIndicator";

const indicatorLabels: Record<InvestmentIndicatorKey, string> = {
  dividendYield: "配当利回り",
  pbr: "PBR",
  per: "PER",
  roe: "ROE"
};

function normalizeIndicatorValue(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function formatMultipleValue(value: number | null) {
  return value === null ? "未入力" : `${value.toFixed(1)}倍`;
}

function formatRatioValue(value: number | null) {
  return value === null ? "未入力" : `${(value * 100).toFixed(1)}%`;
}

type IndicatorJudgement = {
  tone: InvestmentIndicatorTone;
  title: string;
  message: string;
  learningPoint: string;
  checkPoints: string[];
};

const unknownCheckPoints = [
  "分かる範囲で指標を入力する",
  "同業他社や業種平均と比べる",
  "他の指標や財務状態と合わせて確認する"
];

function judgePer(value: number | null): IndicatorJudgement {
  if (value === null) {
    return {
      tone: "unknown",
      title: "PER未入力",
      message: "PERが未入力です。企業利益との比較ができるように、分かる範囲で入力しましょう。",
      learningPoint: "PERは株価と利益の関係を見るための入口です。",
      checkPoints: unknownCheckPoints
    };
  }

  if (value < 10) {
    return {
      tone: "notice",
      title: "PERが低めです",
      message: "利益に対して株価が低く見える可能性があります。ただし、成長性や業績悪化リスクも確認しましょう。",
      learningPoint: "低PERは確認候補ですが、理由を分解して見ることが大切です。",
      checkPoints: ["業種平均と比べる", "利益が一時的に増えていないか確認する", "業績悪化で低PERになっていないか確認する"]
    };
  }

  if (value <= 25) {
    return {
      tone: "good",
      title: "PERは中間的な水準です",
      message: "極端に高い・低いとは言い切れない水準です。成長性や利益率と合わせて確認しましょう。",
      learningPoint: "PERは単独ではなく、利益の質や成長性と一緒に確認します。",
      checkPoints: ["利益成長率を確認する", "同業他社と比較する", "PBRやROEと合わせて見る"]
    };
  }

  return {
    tone: "warning",
    title: "PERが高めです",
    message: "将来の成長期待が株価に織り込まれている可能性があります。成長性が続くか確認しましょう。",
    learningPoint: "高PERでは期待に見合う成長が続くかを確認します。",
    checkPoints: ["売上・利益成長率を確認する", "期待先行で買われすぎていないか確認する", "同業他社と比較する"]
  };
}

function judgePbr(value: number | null): IndicatorJudgement {
  if (value === null) {
    return {
      tone: "unknown",
      title: "PBR未入力",
      message: "PBRが未入力です。純資産との比較ができるように、分かる範囲で入力しましょう。",
      learningPoint: "PBRは株価と純資産の関係を見るための入口です。",
      checkPoints: unknownCheckPoints
    };
  }

  if (value < 1) {
    return {
      tone: "notice",
      title: "PBRが1倍未満です",
      message: "純資産に対して株価が低く評価されている可能性があります。ただし、収益力や資産の質も確認しましょう。",
      learningPoint: "PBRが低いときは、資産の質と収益力を合わせて見ます。",
      checkPoints: ["資産の中身を確認する", "ROEが低くないか確認する", "業種平均と比べる"]
    };
  }

  if (value <= 3) {
    return {
      tone: "good",
      title: "PBRは中間的な水準です",
      message: "純資産に対する評価を確認しつつ、ROEや利益成長も合わせて見ましょう。",
      learningPoint: "PBRはROEや利益成長と組み合わせると読みやすくなります。",
      checkPoints: ["ROEと合わせて確認する", "利益成長を確認する", "同業他社と比較する"]
    };
  }

  return {
    tone: "warning",
    title: "PBRが高めです",
    message: "純資産に対して高く評価されている可能性があります。高ROEや成長性が伴っているか確認しましょう。",
    learningPoint: "高PBRでは収益力や成長期待の裏付けを確認します。",
    checkPoints: ["ROEが高い水準か確認する", "成長性が続くか確認する", "同業他社と比較する"]
  };
}

function judgeRoe(value: number | null): IndicatorJudgement {
  if (value === null) {
    return {
      tone: "unknown",
      title: "ROE未入力",
      message: "ROEが未入力です。資本効率を確認できるように、分かる範囲で入力しましょう。",
      learningPoint: "ROEは自己資本を使って利益を出す力を見る指標です。",
      checkPoints: unknownCheckPoints
    };
  }

  if (value < 0.05) {
    return {
      tone: "warning",
      title: "ROEが低めです",
      message: "自己資本に対して利益を生み出す力が弱く見える可能性があります。",
      learningPoint: "低ROEでは収益力や資本効率の課題を確認します。",
      checkPoints: ["利益率を確認する", "資本効率の過去推移を見る", "同業他社と比較する"]
    };
  }

  if (value < 0.1) {
    return {
      tone: "notice",
      title: "ROEは確認したい水準です",
      message: "資本効率を判断するには、業種平均や過去推移と比較しましょう。",
      learningPoint: "ROEは業種差があるため、単年だけでなく比較して見ます。",
      checkPoints: ["業種平均と比べる", "過去推移を確認する", "PBRとの関係を見る"]
    };
  }

  return {
    tone: "good",
    title: "ROEは比較的高めです",
    message: "自己資本を使って利益を出せている可能性があります。ただし、一時的要因や財務レバレッジも確認しましょう。",
    learningPoint: "高ROEでは持続性と財務レバレッジを確認します。",
    checkPoints: ["一時的な利益でないか確認する", "負債の水準を確認する", "過去推移を確認する"]
  };
}

function judgeDividendYield(value: number | null): IndicatorJudgement {
  if (value === null) {
    return {
      tone: "unknown",
      title: "配当利回り未入力",
      message: "配当利回りが未入力です。配当収入との関係を確認できるように、分かる範囲で入力しましょう。",
      learningPoint: "配当利回りは投資額に対する配当収入の目安です。",
      checkPoints: unknownCheckPoints
    };
  }

  if (value === 0) {
    return {
      tone: "notice",
      title: "配当利回りは0%です",
      message: "成長投資を優先している銘柄の可能性があります。配当より成長性を確認しましょう。",
      learningPoint: "無配銘柄では、配当より成長投資や事業拡大の方針を確認します。",
      checkPoints: ["成長投資の方針を確認する", "売上・利益成長を確認する", "将来の配当方針を確認する"]
    };
  }

  if (value < 0.02) {
    return {
      tone: "notice",
      title: "配当利回りは低めです",
      message: "配当よりも成長性や値上がり益を重視する銘柄か確認しましょう。",
      learningPoint: "低配当では、成長性や株主還元方針を合わせて見ます。",
      checkPoints: ["成長性を確認する", "株主還元方針を確認する", "同業他社と比較する"]
    };
  }

  if (value <= 0.05) {
    return {
      tone: "good",
      title: "配当利回りは中間的な水準です",
      message: "配当収入と業績の安定性を合わせて確認しましょう。",
      learningPoint: "配当利回りは配当の安定性と業績の両方を見ると扱いやすくなります。",
      checkPoints: ["配当の継続性を確認する", "業績の安定性を確認する", "減配リスクを確認する"]
    };
  }

  return {
    tone: "warning",
    title: "配当利回りが高めです",
    message: "高配当に見えますが、減配リスクや株価下落による利回り上昇の可能性も確認しましょう。",
    learningPoint: "高配当では、利回りの高さの理由を分解して確認します。",
    checkPoints: ["減配リスクを確認する", "株価下落で利回りが上がっていないか確認する", "配当性向や業績を確認する"]
  };
}

function buildInsight(
  holding: InvestmentHolding,
  indicatorKey: InvestmentIndicatorKey,
  value: number | null,
  displayValue: string,
  judgement: IndicatorJudgement
): InvestmentIndicatorInsight {
  return {
    id: `${holding.id}:${indicatorKey}`,
    holdingId: holding.id,
    holdingName: holding.name,
    ticker: holding.ticker,
    indicatorKey,
    label: indicatorLabels[indicatorKey],
    value,
    displayValue,
    ...judgement
  };
}

export function buildInvestmentIndicatorReport(holdings: InvestmentHolding[]): InvestmentIndicatorReport {
  const targetHoldings = holdings.filter((holding) => holding.assetType !== "cash");
  const insights = targetHoldings.flatMap((holding) => {
    const per = normalizeIndicatorValue(holding.per);
    const pbr = normalizeIndicatorValue(holding.pbr);
    const roe = normalizeIndicatorValue(holding.roe);
    const dividendYield = normalizeIndicatorValue(holding.dividendYield);

    return [
      buildInsight(holding, "per", per, formatMultipleValue(per), judgePer(per)),
      buildInsight(holding, "pbr", pbr, formatMultipleValue(pbr), judgePbr(pbr)),
      buildInsight(holding, "roe", roe, formatRatioValue(roe), judgeRoe(roe)),
      buildInsight(
        holding,
        "dividendYield",
        dividendYield,
        formatRatioValue(dividendYield),
        judgeDividendYield(dividendYield)
      )
    ];
  });

  return {
    generatedAt: new Date().toISOString(),
    holdingCount: targetHoldings.length,
    insights,
    topics: investmentIndicatorTopics
  };
}
