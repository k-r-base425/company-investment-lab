import { StyleSheet, Text, View } from "react-native";

import { calculateInvestmentHolding } from "../../lib/investment/calculateInvestment";
import type { InvestmentHolding } from "../../lib/types/investment";
import { InvestmentHoldingCard } from "./InvestmentHoldingCard";

type InvestmentHoldingListProps = {
  holdings: InvestmentHolding[];
  onDelete: (id: string) => void;
  onEdit: (holding: InvestmentHolding) => void;
};

export function InvestmentHoldingList({ holdings, onDelete, onEdit }: InvestmentHoldingListProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>保有銘柄リスト</Text>
        <Text style={styles.count}>{holdings.length}件</Text>
      </View>

      {holdings.length > 0 ? (
        <View style={styles.list}>
          {holdings.map((holding) => (
            <InvestmentHoldingCard
              key={holding.id}
              holding={calculateInvestmentHolding(holding)}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>表示できる保有銘柄がありません。</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    width: "100%"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  count: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900"
  },
  list: {
    gap: 10
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  emptyText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19
  }
});
