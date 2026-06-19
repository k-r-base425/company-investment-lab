import { Pressable, StyleSheet, Text, View } from "react-native";

import { accountingTypeLabels, accountingTypeTones } from "../../lib/accounting/accountingOptions";
import type { AccountingEntryType } from "../../lib/types/accounting";

const types: AccountingEntryType[] = ["revenue", "expense", "household", "journal"];

type AccountingTypeTabsProps = {
  activeType: AccountingEntryType;
  onChange: (type: AccountingEntryType) => void;
};

export function AccountingTypeTabs({ activeType, onChange }: AccountingTypeTabsProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>入力タイプ</Text>
      <View style={styles.tabs}>
        {types.map((type) => {
          const active = type === activeType;
          const tone = accountingTypeTones[type];
          return (
            <Pressable
              accessibilityRole="button"
              key={type}
              onPress={() => onChange(type)}
              style={({ pressed }) => [
                styles.tab,
                { borderColor: active ? tone : "#E2E8F0" },
                active && { backgroundColor: tone },
                pressed && styles.tabPressed
              ]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{accountingTypeLabels[type]}</Text>
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
    padding: 14,
    width: "100%"
  },
  title: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 12
  },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    width: "100%"
  },
  tab: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "23%",
    flexGrow: 1,
    justifyContent: "center",
    minHeight: 42,
    minWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 9
  },
  tabPressed: {
    opacity: 0.82
  },
  tabText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "900"
  },
  tabTextActive: {
    color: "#FFFFFF"
  }
});
