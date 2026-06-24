import type { InvestmentIndicatorLearningTopic } from "../types/investmentIndicator";

export const investmentIndicatorTopics: InvestmentIndicatorLearningTopic[] = [
  {
    key: "per",
    label: "PER",
    shortDescription: "株価が利益の何倍まで買われているかを見る指標",
    formulaLabel: "株価 ÷ 1株あたり利益",
    howToRead: "一般に低いほど割安に見えることがありますが、成長性や業種によって目安は変わります。",
    caution: "PERだけで割安・割高を判断しないでください。"
  },
  {
    key: "pbr",
    label: "PBR",
    shortDescription: "株価が純資産の何倍まで買われているかを見る指標",
    formulaLabel: "株価 ÷ 1株あたり純資産",
    howToRead: "1倍を下回ると純資産に対して低く評価されていると見ることがあります。",
    caution: "資産の質や収益力も合わせて確認してください。"
  },
  {
    key: "roe",
    label: "ROE",
    shortDescription: "自己資本を使ってどれだけ利益を出しているかを見る指標",
    formulaLabel: "当期純利益 ÷ 自己資本",
    howToRead: "高いほど資本効率が良いと見ることがあります。",
    caution: "一時的要因や過度なレバレッジで高く見える場合もあります。"
  },
  {
    key: "dividendYield",
    label: "配当利回り",
    shortDescription: "投資額に対して年間配当がどれくらいあるかを見る指標",
    formulaLabel: "1株配当 ÷ 株価",
    howToRead: "高いほど配当収入は大きく見えます。",
    caution: "高配当でも減配リスクや業績悪化リスクがあります。"
  }
];
