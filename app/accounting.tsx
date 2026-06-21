import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AccountingEntryForm } from "../components/accounting/AccountingEntryForm";
import { AccountingAnalysisSection } from "../components/accounting/AccountingAnalysisSection";
import { AccountingInsightsSection } from "../components/accounting/AccountingInsightsSection";
import { AccountingSummaryCards } from "../components/accounting/AccountingSummaryCards";
import { AccountingTypeTabs } from "../components/accounting/AccountingTypeTabs";
import { JournalEntryForm } from "../components/accounting/JournalEntryForm";
import { RecentEntriesList } from "../components/accounting/RecentEntriesList";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import { calculateMonthlyAccountingSummary } from "../lib/accounting/calculateAccountingSummary";
import { sampleAccountingEntries } from "../lib/accounting/sampleAccountingEntries";
import {
  deleteAccountingEntry,
  getAccountingEntriesByMonth,
  initAccountingStorage,
  insertAccountingEntry,
  seedAccountingEntriesIfEmpty,
  updateAccountingEntry
} from "../lib/storage/accountingEntryRepository";
import type { AccountingEntry, AccountingEntryType } from "../lib/types/accounting";

const targetMonth = "2026-06";

export default function AccountingScreen() {
  const [activeType, setActiveType] = useState<AccountingEntryType>("revenue");
  const [entries, setEntries] = useState<AccountingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingEntry, setEditingEntry] = useState<AccountingEntry | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const monthlySummary = calculateMonthlyAccountingSummary(entries, targetMonth);

  useEffect(() => {
    let canceled = false;

    async function initializeStorage() {
      try {
        setIsLoading(true);
        setIsFallbackData(false);
        setStorageError("");
        await initAccountingStorage();
        await seedAccountingEntriesIfEmpty(sampleAccountingEntries);
        const savedEntries = await getAccountingEntriesByMonth(targetMonth);

        if (!canceled) {
          setEntries(savedEntries);
          setIsFallbackData(false);
        }
      } catch {
        if (!canceled) {
          setStorageError("ローカル保存の読み込みに失敗しました。");
          setEntries(sampleAccountingEntries.filter((entry) => entry.date.startsWith(targetMonth)));
          setIsFallbackData(true);
        }
      } finally {
        if (!canceled) {
          setIsLoading(false);
        }
      }
    }

    initializeStorage();

    return () => {
      canceled = true;

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const reloadEntries = async () => {
    const savedEntries = await getAccountingEntriesByMonth(targetMonth);
    setEntries(savedEntries);
    setIsFallbackData(false);
  };

  const showMessage = (message: string) => {
    setSuccessMessage(message);
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }

    successTimerRef.current = setTimeout(() => {
      setSuccessMessage("");
      successTimerRef.current = null;
    }, 2500);
  };

  const handleSubmitEntry = async (entry: AccountingEntry) => {
    try {
      setStorageError("");

      if (editingEntry) {
        await updateAccountingEntry(entry);
        setEditingEntry(null);
        await reloadEntries();
        showMessage("更新しました");
        return true;
      }

      await insertAccountingEntry(entry);
      await reloadEntries();
      showMessage("入力を追加しました");
      return true;
    } catch {
      setStorageError(editingEntry ? "入力の更新に失敗しました。" : "入力の保存に失敗しました。");
      return false;
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      setStorageError("");
      await deleteAccountingEntry(id);
      if (editingEntry?.id === id) {
        setEditingEntry(null);
      }
      await reloadEntries();
      showMessage("削除しました");
    } catch {
      setStorageError("入力の削除に失敗しました。");
    }
  };

  const handleEditEntry = (entry: AccountingEntry) => {
    setStorageError("");
    setSuccessMessage("");
    setActiveType(entry.type);
    setEditingEntry(entry);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  const handleTypeChange = (type: AccountingEntryType) => {
    setActiveType(type);
    setEditingEntry(null);
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

          <AccountingSummaryCards summary={monthlySummary} />

          <AccountingInsightsSection
            entries={entries}
            errorMessage={isFallbackData ? storageError : ""}
            isFallback={isFallbackData}
            isLoading={isLoading}
            month={targetMonth}
            monthLabel="2026年6月"
          />

          <AccountingAnalysisSection
            entries={entries}
            errorMessage={isFallbackData ? storageError : ""}
            isFallback={isFallbackData}
            isLoading={isLoading}
            month={targetMonth}
            monthLabel="2026年6月"
          />

          {isLoading ? <Text style={styles.statusMessage}>保存済みデータを読み込んでいます...</Text> : null}

          {storageError ? <Text style={styles.errorMessage}>{storageError}</Text> : null}

          <AccountingTypeTabs activeType={activeType} onChange={handleTypeChange} />

          {activeType === "journal" ? (
            <JournalEntryForm
              editingEntry={editingEntry?.type === "journal" ? editingEntry : null}
              onCancelEdit={handleCancelEdit}
              onSubmit={handleSubmitEntry}
              submitLabel={editingEntry?.type === "journal" ? "入力を更新" : "入力を追加"}
            />
          ) : (
            <AccountingEntryForm
              editingEntry={editingEntry?.type === activeType ? editingEntry : null}
              onCancelEdit={handleCancelEdit}
              onSubmit={handleSubmitEntry}
              submitLabel={editingEntry?.type === activeType ? "入力を更新" : "入力を追加"}
              type={activeType}
            />
          )}

          {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}

          <RecentEntriesList entries={entries} onDelete={handleDeleteEntry} onEdit={handleEditEntry} />
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
  },
  statusMessage: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "center",
    width: "100%"
  },
  errorMessage: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 8,
    borderWidth: 1,
    color: "#B91C1C",
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
