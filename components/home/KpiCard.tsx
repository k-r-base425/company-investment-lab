import { StyleSheet, Text, View } from "react-native";

import type { HomeKpi, KpiTrend } from "../../lib/types/home";

type KpiCardProps = {
  kpi: HomeKpi;
};

const toneColors: Record<HomeKpi["tone"], { accent: string; soft: string; border: string }> = {
  blue: { accent: "#2563EB", soft: "#EFF6FF", border: "#BFDBFE" },
  green: { accent: "#059669", soft: "#ECFDF5", border: "#A7F3D0" },
  red: { accent: "#EA580C", soft: "#FFF7ED", border: "#FED7AA" },
  purple: { accent: "#7C3AED", soft: "#F5F3FF", border: "#DDD6FE" },
  orange: { accent: "#F97316", soft: "#FFF7ED", border: "#FDBA74" },
  teal: { accent: "#0F766E", soft: "#F0FDFA", border: "#99F6E4" },
  gray: { accent: "#64748B", soft: "#F8FAFC", border: "#CBD5E1" }
};

const trendToneColors: Record<KpiTrend["tone"], string> = {
  positive: "#047857",
  negative: "#B91C1C",
  neutral: "#64748B",
  warning: "#C2410C"
};

export function KpiCard({ kpi }: KpiCardProps) {
  const colors = toneColors[kpi.tone];

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: kpi.emphasis ? colors.accent : colors.border
        },
        kpi.emphasis && styles.emphasisCard
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconBadge, { backgroundColor: colors.soft }]}>
          <Text style={[styles.iconText, { color: colors.accent }]}>{kpi.icon ?? kpi.title}</Text>
        </View>
        <View style={[styles.accentDot, { backgroundColor: colors.accent }]} />
      </View>

      <Text style={styles.title}>{kpi.title}</Text>
      <Text style={[styles.value, kpi.emphasis && styles.emphasisValue]} adjustsFontSizeToFit numberOfLines={1}>
        {kpi.value}
      </Text>
      {kpi.subtitle ? <Text style={styles.subtitle}>{kpi.subtitle}</Text> : null}

      {kpi.trends?.length ? (
        <View style={styles.trendList}>
          {kpi.trends.map((trend) => (
            <View key={`${trend.label}-${trend.value}`} style={styles.trendPill}>
              <Text style={styles.trendLabel}>{trend.label}</Text>
              <Text style={[styles.trendValue, { color: trendToneColors[trend.tone] }]}>{trend.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 154,
    minWidth: 0,
    padding: 13,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2
  },
  emphasisCard: {
    shadowColor: "#059669",
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 4
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 0,
    marginBottom: 10
  },
  iconBadge: {
    alignItems: "center",
    borderRadius: 8,
    minHeight: 28,
    justifyContent: "center",
    maxWidth: "78%",
    paddingHorizontal: 8
  },
  iconText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0
  },
  accentDot: {
    borderRadius: 999,
    height: 9,
    width: 9
  },
  title: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    minWidth: 0,
    marginBottom: 7
  },
  value: {
    color: "#0F172A",
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 26,
    minWidth: 0
  },
  emphasisValue: {
    fontSize: 22
  },
  subtitle: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    marginTop: 6
  },
  trendList: {
    gap: 6,
    marginTop: 12
  },
  trendPill: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 26,
    minWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  trendLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800"
  },
  trendValue: {
    fontSize: 11,
    fontWeight: "900"
  }
});
