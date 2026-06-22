import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { AiAnalysisCard } from "../components/home/AiAnalysisCard";
import { AssetAllocationCard } from "../components/home/AssetAllocationCard";
import { MonthSelector } from "../components/common/MonthSelector";
import { HomeDataStatus } from "../components/home/HomeDataStatus";
import { HomeImprovementActionsCard } from "../components/home/HomeImprovementActionsCard";
import { HomeKpiGrid } from "../components/home/HomeKpiGrid";
import { HomeMonthlyChartCard } from "../components/home/HomeMonthlyChartCard";
import { TodayLearningCard } from "../components/home/TodayLearningCard";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import { useSelectedMonth } from "../contexts/SelectedMonthContext";
import { sampleAccountingEntries } from "../lib/accounting/sampleAccountingEntries";
import { buildHomeKpisFromAccounting } from "../lib/home/buildHomeKpisFromAccounting";
import { sampleAssetAllocation } from "../lib/home/sampleAssetAllocation";
import { sampleLearningTopics } from "../lib/home/sampleLearningTopics";
import { defaultSelectedMonth } from "../lib/month/monthUtils";
import { getAccountingEntriesByMonth, initAccountingStorage } from "../lib/storage/accountingEntryRepository";
import { getImprovementActionsByPeriod, initImprovementActionStorage } from "../lib/storage/improvementActionRepository";
import type { AccountingEntry } from "../lib/types/accounting";
import type { ImprovementAction } from "../lib/types/improvementAction";

const accountingLoadErrorMessage = "会計データの読み込みに失敗しました。";

export default function HomeScreen() {
  const { selectedMonth, selectedMonthLabel } = useSelectedMonth();
  const [accountingEntries, setAccountingEntries] = useState<AccountingEntry[]>(sampleAccountingEntries);
  const [savedEntryCount, setSavedEntryCount] = useState(0);
  const [isFallback, setIsFallback] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [improvementActions, setImprovementActions] = useState<ImprovementAction[]>([]);
  const [isActionLoading, setIsActionLoading] = useState(true);
  const [actionErrorMessage, setActionErrorMessage] = useState("");
  const kpis = useMemo(
    () => buildHomeKpisFromAccounting({ entries: accountingEntries, month: selectedMonth }),
    [accountingEntries, selectedMonth]
  );
  const hasNoData = !isFallback && savedEntryCount === 0;

  const loadAccountingEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      await initAccountingStorage();
      const savedEntries = await getAccountingEntriesByMonth(selectedMonth);

      if (savedEntries.length > 0) {
        setAccountingEntries(savedEntries);
        setSavedEntryCount(savedEntries.length);
        setIsFallback(false);
        return;
      }

      if (selectedMonth === defaultSelectedMonth) {
        setAccountingEntries(sampleAccountingEntries);
        setSavedEntryCount(sampleAccountingEntries.length);
        setIsFallback(true);
        return;
      }

      setAccountingEntries([]);
      setSavedEntryCount(0);
      setIsFallback(false);
    } catch {
      if (selectedMonth === defaultSelectedMonth) {
        setAccountingEntries(sampleAccountingEntries);
        setSavedEntryCount(sampleAccountingEntries.length);
        setIsFallback(true);
      } else {
        setAccountingEntries([]);
        setSavedEntryCount(0);
        setIsFallback(false);
      }
      setErrorMessage(accountingLoadErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  const loadImprovementActions = useCallback(async () => {
    try {
      setIsActionLoading(true);
      setActionErrorMessage("");
      await initImprovementActionStorage();
      const savedActions = await getImprovementActionsByPeriod(selectedMonth);
      setImprovementActions(savedActions);
    } catch {
      setImprovementActions([]);
      setActionErrorMessage("改善アクションの読み込みに失敗しました。");
    } finally {
      setIsActionLoading(false);
    }
  }, [selectedMonth]);

  useFocusEffect(
    useCallback(() => {
      loadAccountingEntries();
      loadImprovementActions();
    }, [loadAccountingEntries, loadImprovementActions])
  );

  return (
    <View style={styles.root}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.contentInner}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.kicker}>Account Invest Lab</Text>
              <Text style={styles.heading}>ダッシュボード</Text>
            </View>
            <Text style={styles.monthLabel}>{selectedMonthLabel}</Text>
          </View>

          <MonthSelector />

          <HomeDataStatus
            entryCount={savedEntryCount}
            errorMessage={errorMessage}
            hasNoData={hasNoData}
            isFallback={isFallback}
            isLoading={isLoading}
            monthLabel={selectedMonthLabel}
            onRefresh={loadAccountingEntries}
          />

          <HomeKpiGrid kpis={kpis} />

          <HomeMonthlyChartCard
            entries={accountingEntries}
            errorMessage={errorMessage}
            isFallback={isFallback}
            isLoading={isLoading}
            month={selectedMonth}
            monthLabel={selectedMonthLabel}
          />

          <AssetAllocationCard summary={sampleAssetAllocation} />

          <TodayLearningCard topics={sampleLearningTopics} />

          <HomeImprovementActionsCard
            actions={improvementActions}
            entries={accountingEntries}
            errorMessage={actionErrorMessage}
            isLoading={isActionLoading}
            monthLabel={selectedMonthLabel}
            period={selectedMonth}
          />

          <AiAnalysisCard />

          <View style={styles.shortcutGrid}>
            <Shortcut label="会計入力" />
            <Shortcut label="家計簿" />
            <Shortcut label="投資分析" />
            <Shortcut label="CSV出力" />
          </View>
        </View>
      </ScrollView>
      <BottomTabBar activeTab="home" />
    </View>
  );
}

type ShortcutProps = {
  label: string;
};

function Shortcut({ label }: ShortcutProps) {
  return (
    <View style={styles.shortcut}>
      <Text style={styles.shortcutText}>{label}</Text>
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
    marginBottom: 18,
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
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  shortcut: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: "center",
    padding: 10,
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0
  },
  shortcutText: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "800"
  }
});
