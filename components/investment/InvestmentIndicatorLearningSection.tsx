import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { buildInvestmentIndicatorReport } from "../../lib/investment/buildInvestmentIndicatorReport";
import type { InvestmentHolding } from "../../lib/types/investment";
import type { InvestmentIndicatorInsight, InvestmentIndicatorTone } from "../../lib/types/investmentIndicator";

type InvestmentIndicatorLearningSectionProps = {
  holdings: InvestmentHolding[];
};

const toneLabels: Record<InvestmentIndicatorTone, string> = {
  good: "良好",
  notice: "確認",
  unknown: "未入力",
  warning: "注意"
};

const positionLabels: Record<InvestmentHolding["positionType"], string> = {
  actual: "実保有",
  virtual: "仮想保有"
};

const tonePriority: Record<InvestmentIndicatorTone, number> = {
  warning: 0,
  unknown: 1,
  notice: 2,
  good: 3
};

function getToneStyle(tone: InvestmentIndicatorTone) {
  switch (tone) {
    case "good":
      return styles.toneGood;
    case "notice":
      return styles.toneNotice;
    case "warning":
      return styles.toneWarning;
    case "unknown":
    default:
      return styles.toneUnknown;
  }
}

function getToneTextStyle(tone: InvestmentIndicatorTone) {
  switch (tone) {
    case "good":
      return styles.toneGoodText;
    case "notice":
      return styles.toneNoticeText;
    case "warning":
      return styles.toneWarningText;
    case "unknown":
    default:
      return styles.toneUnknownText;
  }
}

export function InvestmentIndicatorLearningSection({ holdings }: InvestmentIndicatorLearningSectionProps) {
  const report = useMemo(() => buildInvestmentIndicatorReport(holdings), [holdings]);
  const nonCashHoldings = holdings.filter((holding) => holding.assetType !== "cash");
  const alerts = report.insights
    .filter((insight) => insight.tone === "warning" || insight.tone === "unknown")
    .sort((a, b) => tonePriority[a.tone] - tonePriority[b.tone])
    .slice(0, 5);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>投資指標学習</Text>
        <Text style={styles.subtitle}>保存済み銘柄のPER / PBR / ROE / 配当利回りを確認します。</Text>
        <Text style={styles.notice}>
          株価・指標は手入力またはサンプルです。投資判断は複数の情報を確認して行います。
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>指標の基本</Text>
        <View style={styles.topicList}>
          {report.topics.map((topic) => (
            <View key={topic.key} style={styles.topicItem}>
              <Text style={styles.topicLabel}>{topic.label}</Text>
              <Text style={styles.topicDescription}>{topic.shortDescription}</Text>
              <Text style={styles.topicMeta}>計算式：{topic.formulaLabel}</Text>
              <Text style={styles.topicText}>{topic.howToRead}</Text>
              <Text style={styles.topicCaution}>注意：{topic.caution}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>銘柄別 指標チェック</Text>
        {nonCashHoldings.length === 0 ? (
          <Text style={styles.emptyText}>指標チェック対象の銘柄がありません。現金以外の銘柄を追加すると確認できます。</Text>
        ) : (
          <View style={styles.holdingList}>
            {nonCashHoldings.map((holding) => {
              const insights = report.insights.filter((insight) => insight.holdingId === holding.id);

              return (
                <View key={holding.id} style={styles.holdingBlock}>
                  <View style={styles.holdingHeader}>
                    <View style={styles.holdingTitleWrap}>
                      <Text style={styles.holdingName}>{holding.name}</Text>
                      {holding.ticker ? <Text style={styles.holdingTicker}>{holding.ticker}</Text> : null}
                    </View>
                    <Text style={[styles.positionBadge, holding.positionType === "virtual" && styles.virtualBadge]}>
                      {positionLabels[holding.positionType]}
                    </Text>
                  </View>

                  <View style={styles.insightGrid}>
                    {insights.map((insight) => (
                      <IndicatorMiniCard key={insight.id} insight={insight} />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>要確認ポイント</Text>
        {alerts.length === 0 ? (
          <Text style={styles.emptyText}>大きな注意ポイントはありません。引き続き業種比較や財務情報を確認しましょう。</Text>
        ) : (
          <View style={styles.alertList}>
            {alerts.map((insight) => (
              <View key={insight.id} style={styles.alertItem}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertHolding}>{insight.holdingName}</Text>
                  <Text style={[styles.toneBadge, getToneStyle(insight.tone), getToneTextStyle(insight.tone)]}>
                    {insight.label}・{toneLabels[insight.tone]}
                  </Text>
                </View>
                <Text style={styles.alertTitle}>{insight.title}</Text>
                <Text style={styles.alertMessage}>{insight.message}</Text>
                <View style={styles.checkPointList}>
                  {insight.checkPoints.map((point) => (
                    <Text key={point} style={styles.checkPoint}>
                      ・{point}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

type IndicatorMiniCardProps = {
  insight: InvestmentIndicatorInsight;
};

function IndicatorMiniCard({ insight }: IndicatorMiniCardProps) {
  return (
    <View style={styles.indicatorMiniCard}>
      <View style={styles.indicatorHeader}>
        <Text style={styles.indicatorLabel}>{insight.label}</Text>
        <Text style={[styles.toneBadge, getToneStyle(insight.tone), getToneTextStyle(insight.tone)]}>
          {toneLabels[insight.tone]}
        </Text>
      </View>
      <Text style={styles.indicatorValue}>{insight.displayValue}</Text>
      <Text style={styles.indicatorTitle}>{insight.title}</Text>
      <Text style={styles.indicatorMessage}>{insight.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    marginTop: 16,
    width: "100%"
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24
  },
  subtitle: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  notice: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 10,
    padding: 10
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
    marginBottom: 10
  },
  topicList: {
    gap: 10
  },
  topicItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10
  },
  topicLabel: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  topicDescription: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 4
  },
  topicMeta: {
    color: "#0F766E",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 6
  },
  topicText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 4
  },
  topicCaution: {
    color: "#92400E",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 17,
    marginTop: 4
  },
  emptyText: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    padding: 10
  },
  holdingList: {
    gap: 12
  },
  holdingBlock: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10
  },
  holdingHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 10,
    minWidth: 0
  },
  holdingTitleWrap: {
    flex: 1,
    minWidth: 0
  },
  holdingName: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  holdingTicker: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 2
  },
  positionBadge: {
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
    color: "#1D4ED8",
    flexShrink: 0,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  virtualBadge: {
    backgroundColor: "#F3E8FF",
    color: "#7E22CE"
  },
  insightGrid: {
    gap: 8
  },
  indicatorMiniCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 10
  },
  indicatorHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    minWidth: 0
  },
  indicatorLabel: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  indicatorValue: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 22,
    marginTop: 6
  },
  indicatorTitle: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 4
  },
  indicatorMessage: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 3
  },
  toneBadge: {
    borderRadius: 999,
    flexShrink: 0,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: "center"
  },
  toneGood: {
    backgroundColor: "#DCFCE7"
  },
  toneGoodText: {
    color: "#166534"
  },
  toneNotice: {
    backgroundColor: "#DBEAFE"
  },
  toneNoticeText: {
    color: "#1D4ED8"
  },
  toneWarning: {
    backgroundColor: "#FFEDD5"
  },
  toneWarningText: {
    color: "#C2410C"
  },
  toneUnknown: {
    backgroundColor: "#E2E8F0"
  },
  toneUnknownText: {
    color: "#475569"
  },
  alertList: {
    gap: 10
  },
  alertItem: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderRadius: 8,
    borderWidth: 1,
    padding: 10
  },
  alertHeader: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between"
  },
  alertHolding: {
    color: "#0F172A",
    flex: 1,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
    minWidth: 120
  },
  alertTitle: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 8
  },
  alertMessage: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 3
  },
  checkPointList: {
    gap: 3,
    marginTop: 7
  },
  checkPoint: {
    color: "#334155",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 17
  }
});
