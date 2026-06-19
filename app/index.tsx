import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { AiAnalysisCard } from "../components/home/AiAnalysisCard";
import { AssetAllocationCard } from "../components/home/AssetAllocationCard";
import { HomeDataStatus } from "../components/home/HomeDataStatus";
import { HomeKpiGrid } from "../components/home/HomeKpiGrid";
import { TodayLearningCard } from "../components/home/TodayLearningCard";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import { sampleAccountingEntries } from "../lib/accounting/sampleAccountingEntries";
import { sampleMonthlyChartDays } from "../lib/ai/sampleAiAnalysisPayload";
import { buildHomeKpisFromAccounting } from "../lib/home/buildHomeKpisFromAccounting";
import { sampleAssetAllocation } from "../lib/home/sampleAssetAllocation";
import { sampleLearningTopics } from "../lib/home/sampleLearningTopics";
import { getAccountingEntriesByMonth, initAccountingStorage } from "../lib/storage/accountingEntryRepository";
import type { AccountingEntry } from "../lib/types/accounting";
import type { AiAnalysisDay } from "../lib/types/ai";

const targetMonth = "2026-06";
const monthLabel = "2026年6月";
const accountingLoadErrorMessage = "会計データの読み込みに失敗しました。サンプルデータを表示しています。";

export default function HomeScreen() {
  const [accountingEntries, setAccountingEntries] = useState<AccountingEntry[]>(sampleAccountingEntries);
  const [savedEntryCount, setSavedEntryCount] = useState(0);
  const [isFallback, setIsFallback] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const kpis = useMemo(
    () => buildHomeKpisFromAccounting({ entries: accountingEntries, month: targetMonth }),
    [accountingEntries]
  );

  const loadAccountingEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      await initAccountingStorage();
      const savedEntries = await getAccountingEntriesByMonth(targetMonth);

      if (savedEntries.length > 0) {
        setAccountingEntries(savedEntries);
        setSavedEntryCount(savedEntries.length);
        setIsFallback(false);
        return;
      }

      setAccountingEntries(sampleAccountingEntries);
      setSavedEntryCount(0);
      setIsFallback(true);
    } catch {
      setAccountingEntries(sampleAccountingEntries);
      setSavedEntryCount(0);
      setIsFallback(true);
      setErrorMessage(accountingLoadErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccountingEntries();
    }, [loadAccountingEntries])
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
            <Text style={styles.monthLabel}>{monthLabel}</Text>
          </View>

          <HomeDataStatus
            entryCount={savedEntryCount}
            errorMessage={errorMessage}
            isFallback={isFallback}
            isLoading={isLoading}
            monthLabel={monthLabel}
            onRefresh={loadAccountingEntries}
          />

          <HomeKpiGrid kpis={kpis} />

          <MonthlyChart days={sampleMonthlyChartDays} />

          <AssetAllocationCard summary={sampleAssetAllocation} />

          <TodayLearningCard topics={sampleLearningTopics} />

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

type MonthlyChartProps = {
  days: AiAnalysisDay[];
};

function MonthlyChart({ days }: MonthlyChartProps) {
  const maxValue = Math.max(...days.map((day) => day.value ?? 0));

  return (
    <View style={styles.chartCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.panelTitle}>月グラフ</Text>
        <Text style={styles.sectionHint}>日別売上サンプル</Text>
      </View>

      <View style={styles.chartGrid}>
        {days.map((day) => {
          const height = day.value === null ? 8 : Math.max((day.value / maxValue) * 96, 18);
          return (
            <View key={day.date} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor: getBarColor(day.status),
                    opacity: day.status === "empty" ? 0.55 : 1
                  }
                ]}
              />
              {day.day % 5 === 0 ? <Text style={styles.barLabel}>{day.day}</Text> : <View style={styles.barLabelSpace} />}
            </View>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <Legend color="#2563EB" label="高" />
        <Legend color="#10B981" label="中" />
        <Legend color="#F97316" label="低" />
        <Legend color="#CBD5E1" label="未入力" />
      </View>
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

type LegendProps = {
  color: string;
  label: string;
};

function Legend({ color, label }: LegendProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function getBarColor(status: AiAnalysisDay["status"]) {
  switch (status) {
    case "high":
      return "#2563EB";
    case "middle":
      return "#10B981";
    case "low":
      return "#F97316";
    case "empty":
      return "#CBD5E1";
    default:
      return "#CBD5E1";
  }
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
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
    width: "100%"
  },
  sectionHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
    minWidth: 0
  },
  sectionHint: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700"
  },
  panelTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0
  },
  chartGrid: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 3,
    height: 126,
    minWidth: 0,
    width: "100%"
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  bar: {
    borderRadius: 4,
    minWidth: 5,
    width: "100%"
  },
  barLabel: {
    color: "#94A3B8",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 6
  },
  barLabelSpace: {
    height: 16
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5
  },
  legendDot: {
    borderRadius: 999,
    height: 8,
    width: 8
  },
  legendText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700"
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
