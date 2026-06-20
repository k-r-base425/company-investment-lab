import { StyleSheet, Text, View } from "react-native";

import type { CategoryBreakdownItem } from "../../lib/types/accountingAnalysis";
import { BreakdownBarList } from "./BreakdownBarList";

type CategoryBreakdownCardProps = {
  emptyMessage: string;
  items: CategoryBreakdownItem[];
  maxItems?: number;
  memo?: string;
  title: string;
  tone: string;
};

export function CategoryBreakdownCard({ emptyMessage, items, maxItems, memo, title, tone }: CategoryBreakdownCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.dot, { backgroundColor: tone }]} />
      </View>
      <BreakdownBarList emptyMessage={emptyMessage} items={items} maxItems={maxItems} tone={tone} />
      {memo ? <Text style={styles.memo}>{memo}</Text> : null}
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
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12
  },
  title: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0
  },
  dot: {
    borderRadius: 999,
    height: 10,
    width: 10
  },
  memo: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 12,
    padding: 10
  }
});
