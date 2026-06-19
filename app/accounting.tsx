import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AccountingEntryForm } from "../components/accounting/AccountingEntryForm";
import { AccountingSummaryCards } from "../components/accounting/AccountingSummaryCards";
import { AccountingTypeTabs } from "../components/accounting/AccountingTypeTabs";
import { JournalEntryForm } from "../components/accounting/JournalEntryForm";
import { RecentEntriesList } from "../components/accounting/RecentEntriesList";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import { sampleAccountingEntries } from "../lib/accounting/sampleAccountingEntries";
import type { AccountingEntry, AccountingEntryType } from "../lib/types/accounting";

export default function AccountingScreen() {
  const [activeType, setActiveType] = useState<AccountingEntryType>("revenue");
  const [entries, setEntries] = useState<AccountingEntry[]>(sampleAccountingEntries);
  const [successMessage, setSuccessMessage] = useState("");
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleAddEntry = (entry: AccountingEntry) => {
    setEntries((currentEntries) => [entry, ...currentEntries]);
    setSuccessMessage("入力を追加しました");

    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }

    successTimerRef.current = setTimeout(() => {
      setSuccessMessage("");
      successTimerRef.current = null;
    }, 2500);
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.contentInner}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.kicker}>Account Invest Lab</Text>
              <Text style={styles.heading}>会計入力</Text>
              <Text style={styles.subtitle}>売上・経費・家計・仕訳を記録する</Text>
            </View>
            <Text style={styles.monthLabel}>2026年6月</Text>
          </View>

          <AccountingSummaryCards />

          <AccountingTypeTabs activeType={activeType} onChange={setActiveType} />

          {activeType === "journal" ? (
            <JournalEntryForm onAdd={handleAddEntry} />
          ) : (
            <AccountingEntryForm onAdd={handleAddEntry} type={activeType} />
          )}

          {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}

          <RecentEntriesList entries={entries} />
        </View>
      </ScrollView>
      <BottomTabBar activeTab="accounting" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#F6F8FC",
    flex: 1,
    width: "100%"
  },
  screen: {
    backgroundColor: "#F6F8FC",
    flex: 1
  },
  content: {
    alignItems: "center",
    paddingBottom: 132,
    paddingHorizontal: 16,
    paddingTop: 50
  },
  contentInner: {
    alignSelf: "center",
    maxWidth: 430,
    minWidth: 0,
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    minWidth: 0
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  kicker: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    marginBottom: 4
  },
  heading: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 6
  },
  monthLabel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  successMessage: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#047857",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "center",
    width: "100%"
  }
});
