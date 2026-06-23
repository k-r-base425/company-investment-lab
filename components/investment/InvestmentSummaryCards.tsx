import { StyleSheet, Text, View } from "react-native";

import type { InvestmentSummary } from "../../lib/types/investment";
import { formatInvestmentAmount, formatInvestmentPercent, formatSignedInvestmentAmount } from "./investmentFormatters";

type InvestmentSummaryCardsProps = {
  summary: InvestmentSummary;
};

export function InvestmentSummaryCards({ summary }: InvestmentSummaryCardsProps) {
  const gainTone = summary.gainLossTotal >= 0 ? styles.positiveValue : styles.warningValue;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>投資サマリー</Text>
        <Text style={styles.subtitle}>保有銘柄データからサンプル計算</Text>
      </View>

      <View style={styles.grid}>
        <SummaryItem label="総評価額" value={formatInvestmentAmount(summary.marketValueTotal)} />
        <SummaryItem label="取得金額" value={formatInvestmentAmount(summary.acquisitionTotal)} />
        <SummaryItem label="評価損益" value={formatSignedInvestmentAmount(summary.gainLossTotal)} valueStyle={gainTone} />
        <SummaryItem label="評価損益率" value={formatInvestmentPercent(summary.gainLossRate, true)} valueStyle={gainTone} />
        <SummaryItem label="現金比率" value={formatInvestmentPercent(summary.cashRatio)} />
        <SummaryItem label="仮想保有評価額" value={formatInvestmentAmount(summary.virtualMarketValue)} />
      </View>
    </View>
  );
}

type SummaryItemProps = {
  label: string;
  value: string;
  valueStyle?: object;
};

function SummaryItem({ label, value, valueStyle }: SummaryItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 14,
    width: "100%"
  },
  header: {
    marginBottom: 12
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  item: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 66,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  label: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16
  },
  value: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 23,
    marginTop: 5,
    minWidth: 0
  },
  positiveValue: {
    color: "#047857"
  },
  warningValue: {
    color: "#C2410C"
  }
});
