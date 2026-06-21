import { StyleSheet, Text, View } from "react-native";

import type { AccountingInsight, AccountingInsightSeverity } from "../../lib/types/accountingInsight";

type AccountingInsightCardProps = {
  insight: AccountingInsight;
};

const severityLabels: Record<AccountingInsightSeverity, string> = {
  good: "良好",
  notice: "確認",
  warning: "注意",
  danger: "要対応"
};

const severityColors: Record<AccountingInsightSeverity, string> = {
  good: "#059669",
  notice: "#2563EB",
  warning: "#EA580C",
  danger: "#DC2626"
};

const severityBackgrounds: Record<AccountingInsightSeverity, string> = {
  good: "#ECFDF5",
  notice: "#EFF6FF",
  warning: "#FFF7ED",
  danger: "#FEF2F2"
};

export function AccountingInsightCard({ insight }: AccountingInsightCardProps) {
  const color = severityColors[insight.severity];

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: severityBackgrounds[insight.severity], borderColor: color }]}>
          <Text style={[styles.badgeText, { color }]}>{severityLabels[insight.severity]}</Text>
        </View>
        {insight.metricLabel && insight.metricValue ? (
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>{insight.metricLabel}</Text>
            <Text style={styles.metricValue}>{insight.metricValue}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{insight.title}</Text>
      <Text style={styles.message}>{insight.message}</Text>

      {insight.relatedData?.length ? (
        <View style={styles.relatedGrid}>
          {insight.relatedData.map((item) => (
            <View key={item.label} style={styles.relatedItem}>
              <Text style={styles.relatedLabel}>{item.label}</Text>
              <Text style={styles.relatedValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationLabel}>推奨アクション</Text>
        <Text style={styles.recommendationText}>{insight.recommendation}</Text>
      </View>

      <View style={styles.actionList}>
        {insight.actionItems.map((actionItem) => (
          <View key={actionItem} style={styles.actionRow}>
            <View style={[styles.actionDot, { backgroundColor: color }]} />
            <Text style={styles.actionText}>{actionItem}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderLeftWidth: 4,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0
  },
  metricPill: {
    alignItems: "flex-end",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexShrink: 1,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  metricLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800"
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2
  },
  title: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
    marginTop: 12
  },
  message: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 6
  },
  relatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  relatedItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexGrow: 1,
    minWidth: 120,
    padding: 9
  },
  relatedLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800"
  },
  relatedValue: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2
  },
  recommendationBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginTop: 12,
    padding: 10
  },
  recommendationLabel: {
    color: "#334155",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 4
  },
  recommendationText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18
  },
  actionList: {
    gap: 8,
    marginTop: 12
  },
  actionRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    minWidth: 0
  },
  actionDot: {
    borderRadius: 999,
    height: 6,
    marginTop: 7,
    width: 6
  },
  actionText: {
    color: "#334155",
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    minWidth: 0
  }
});
