import { Pressable, StyleSheet, Text, View } from "react-native";

import type { MonthlyChartMetric } from "../../lib/types/monthlyChart";

type MonthlyChartMetricTabsProps = {
  activeMetric: MonthlyChartMetric;
  onChange: (metric: MonthlyChartMetric) => void;
};

const metricOptions: Array<{ label: string; value: MonthlyChartMetric }> = [
  { label: "売上", value: "revenue" },
  { label: "経費", value: "expense" },
  { label: "利益", value: "profit" },
  { label: "家計", value: "household" }
];

export function MonthlyChartMetricTabs({ activeMetric, onChange }: MonthlyChartMetricTabsProps) {
  return (
    <View style={styles.tabs}>
      {metricOptions.map((option) => {
        const active = option.value === activeMetric;
        return (
          <Pressable
            accessibilityRole="button"
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.tab, active && styles.tabActive, pressed && styles.tabPressed]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    marginTop: 14,
    padding: 4,
    width: "100%"
  },
  tab: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    minHeight: 36,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 8
  },
  tabActive: {
    backgroundColor: "#2563EB"
  },
  tabPressed: {
    opacity: 0.78
  },
  tabText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  tabTextActive: {
    color: "#FFFFFF"
  }
});
