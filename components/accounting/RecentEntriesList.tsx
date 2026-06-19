import { StyleSheet, Text, View } from "react-native";

import { accountingTypeLabels, accountingTypeTones } from "../../lib/accounting/accountingOptions";
import type { AccountingEntry } from "../../lib/types/accounting";

type RecentEntriesListProps = {
  entries: AccountingEntry[];
};

export function RecentEntriesList({ entries }: RecentEntriesListProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>最近の入力</Text>
        <Text style={styles.count}>{entries.length}件</Text>
      </View>

      <View style={styles.list}>
        {entries.map((entry) => (
          <EntryRow entry={entry} key={entry.id} />
        ))}
      </View>
    </View>
  );
}

type EntryRowProps = {
  entry: AccountingEntry;
};

function EntryRow({ entry }: EntryRowProps) {
  const tone = accountingTypeTones[entry.type];

  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <Text style={styles.date}>{entry.date}</Text>
        <View style={[styles.typeBadge, { backgroundColor: tone }]}>
          <Text style={styles.typeBadgeText}>{accountingTypeLabels[entry.type]}</Text>
        </View>
      </View>

      <Text style={styles.memo}>{entry.memo}</Text>

      {entry.type === "journal" ? (
        <View style={styles.journalBox}>
          <Text style={styles.detailText}>
            借方：{entry.debitAccount} {formatYen(entry.debitAmount ?? 0)}
          </Text>
          <Text style={styles.detailText}>
            貸方：{entry.creditAccount} {formatYen(entry.creditAmount ?? 0)}
          </Text>
        </View>
      ) : (
        <View style={styles.detailRow}>
          <Text style={styles.category}>{entry.category}</Text>
          <Text style={[styles.amount, { color: tone }]}>{formatYen(entry.amount)}</Text>
        </View>
      )}
    </View>
  );
}

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
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
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0
  },
  count: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800"
  },
  list: {
    gap: 10
  },
  row: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12
  },
  rowTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  date: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800"
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900"
  },
  memo: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20,
    marginTop: 9
  },
  detailRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 9,
    minWidth: 0
  },
  category: {
    color: "#475569",
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    minWidth: 0
  },
  amount: {
    fontSize: 14,
    fontWeight: "900"
  },
  journalBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    marginTop: 9,
    padding: 10
  },
  detailText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18
  }
});
