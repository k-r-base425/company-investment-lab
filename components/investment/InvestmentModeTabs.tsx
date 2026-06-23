import { Pressable, StyleSheet, Text, View } from "react-native";

import type { InvestmentHoldingMode } from "../../lib/types/investment";

type InvestmentModeTabsProps = {
  mode: InvestmentHoldingMode;
  onChange: (mode: InvestmentHoldingMode) => void;
};

const tabs: { label: string; value: InvestmentHoldingMode }[] = [
  { label: "実保有", value: "actual" },
  { label: "仮想保有", value: "virtual" },
  { label: "すべて", value: "all" }
];

export function InvestmentModeTabs({ mode, onChange }: InvestmentModeTabsProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>保有区分</Text>
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const active = mode === tab.value;
          return (
            <Pressable
              accessibilityRole="button"
              key={tab.value}
              onPress={() => onChange(tab.value)}
              style={({ pressed }) => [styles.tab, active && styles.tabActive, pressed && styles.tabPressed]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
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
    padding: 12,
    width: "100%"
  },
  title: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
    marginBottom: 10
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    minWidth: 0
  },
  tab: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 40,
    minWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 10
  },
  tabActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#818CF8"
  },
  tabPressed: {
    opacity: 0.78
  },
  tabText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  tabTextActive: {
    color: "#3730A3"
  }
});
