import { Pressable, StyleSheet, Text, View } from "react-native";

import { investmentAssetTypeLabels } from "../../lib/investment/calculateInvestment";
import type { InvestmentHoldingCalculated } from "../../lib/types/investment";
import {
  formatInvestmentAmount,
  formatInvestmentMultiple,
  formatInvestmentPercent,
  formatOptionalInvestmentPercent,
  formatSignedInvestmentAmount
} from "./investmentFormatters";

type InvestmentHoldingCardProps = {
  holding: InvestmentHoldingCalculated;
  onAnalyze: (holding: InvestmentHoldingCalculated) => void;
  onEdit: (holding: InvestmentHoldingCalculated) => void;
  onDelete: (id: string) => void;
};

export function InvestmentHoldingCard({ holding, onAnalyze, onDelete, onEdit }: InvestmentHoldingCardProps) {
  const gainPositive = holding.gainLoss >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.name}>{holding.name}</Text>
          <Text style={styles.ticker}>{holding.ticker || "コード未設定"} / {investmentAssetTypeLabels[holding.assetType]}</Text>
        </View>
        <Text style={[styles.positionBadge, holding.positionType === "virtual" ? styles.virtualBadge : styles.actualBadge]}>
          {holding.positionType === "virtual" ? "仮想保有" : "実保有"}
        </Text>
      </View>

      <View style={styles.amountGrid}>
        <Metric label="数量" value={holding.quantity.toLocaleString("ja-JP")} />
        <Metric label="平均取得単価" value={formatInvestmentAmount(holding.averageCost)} />
        <Metric label="現在価格" value={formatInvestmentAmount(holding.currentPrice)} />
        <Metric label="取得金額" value={formatInvestmentAmount(holding.acquisitionAmount)} />
        <Metric label="評価額" value={formatInvestmentAmount(holding.marketValue)} />
        <Metric
          label="評価損益"
          value={`${formatSignedInvestmentAmount(holding.gainLoss)} / ${formatInvestmentPercent(holding.gainLossRate, true)}`}
          valueStyle={gainPositive ? styles.positiveText : styles.warningText}
        />
      </View>

      <View style={styles.indicatorGrid}>
        <Indicator label="配当利回り" value={formatOptionalInvestmentPercent(holding.dividendYield)} />
        <Indicator label="PER" value={formatInvestmentMultiple(holding.per)} />
        <Indicator label="PBR" value={formatInvestmentMultiple(holding.pbr)} />
        <Indicator label="ROE" value={formatOptionalInvestmentPercent(holding.roe)} />
      </View>

      {holding.memo ? (
        <View style={styles.memoBox}>
          <Text style={styles.memoText}>{holding.memo}</Text>
        </View>
      ) : null}

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onAnalyze(holding)}
          style={({ pressed }) => [styles.actionButton, styles.analysisButton, pressed && styles.actionButtonPressed]}
        >
          <Text style={[styles.actionText, styles.analysisText]}>銘柄AI分析</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onEdit(holding)}
          style={({ pressed }) => [styles.actionButton, styles.editButton, pressed && styles.actionButtonPressed]}
        >
          <Text style={[styles.actionText, styles.editText]}>編集</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onDelete(holding.id)}
          style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.actionButtonPressed]}
        >
          <Text style={[styles.actionText, styles.deleteText]}>削除</Text>
        </Pressable>
      </View>
    </View>
  );
}

type MetricProps = {
  label: string;
  value: string;
  valueStyle?: object;
};

function Metric({ label, value, valueStyle }: MetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, valueStyle]}>{value}</Text>
    </View>
  );
}

function Indicator({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.indicator}>
      <Text style={styles.indicatorLabel}>{label}</Text>
      <Text style={styles.indicatorValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0
  },
  titleBlock: {
    flex: 1,
    minWidth: 0
  },
  name: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 23
  },
  ticker: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
    marginTop: 3
  },
  positionBadge: {
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  actualBadge: {
    backgroundColor: "#ECFDF5",
    color: "#047857"
  },
  virtualBadge: {
    backgroundColor: "#F5F3FF",
    color: "#6D28D9"
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  metric: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0,
    paddingHorizontal: 9,
    paddingVertical: 8
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 15
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 3
  },
  positiveText: {
    color: "#047857"
  },
  warningText: {
    color: "#C2410C"
  },
  indicatorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  indicator: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    flexBasis: "23%",
    flexGrow: 1,
    minWidth: 68,
    paddingHorizontal: 8,
    paddingVertical: 7
  },
  indicatorLabel: {
    color: "#1D4ED8",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 15
  },
  indicatorValue: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
    marginTop: 2
  },
  memoBox: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 10
  },
  memoText: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  actionButton: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    minHeight: 40,
    minWidth: 104,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  editButton: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE"
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA"
  },
  analysisButton: {
    backgroundColor: "#F5F3FF",
    borderColor: "#C4B5FD"
  },
  actionButtonPressed: {
    opacity: 0.78
  },
  actionText: {
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  editText: {
    color: "#1D4ED8"
  },
  deleteText: {
    color: "#B91C1C"
  },
  analysisText: {
    color: "#6D28D9"
  }
});
