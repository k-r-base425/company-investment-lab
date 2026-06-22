import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { buildAccountingInsights } from "../../lib/accounting/buildAccountingInsights";
import type { AccountingEntry } from "../../lib/types/accounting";
import type { CategoryMonthlyComparisonSummary } from "../../lib/types/categoryMonthlyComparison";
import type { MonthlyComparisonSummary } from "../../lib/types/monthlyComparison";
import { AccountingInsightCard } from "./AccountingInsightCard";

type AccountingInsightsSectionProps = {
  entries: AccountingEntry[];
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
  month: string;
  monthLabel: string;
  categoryMonthlyComparison?: CategoryMonthlyComparisonSummary;
  monthlyComparison?: MonthlyComparisonSummary;
};

export function AccountingInsightsSection({
  entries,
  errorMessage,
  isFallback,
  isLoading,
  month,
  monthLabel,
  categoryMonthlyComparison,
  monthlyComparison
}: AccountingInsightsSectionProps) {
  const insights = useMemo(
    () => buildAccountingInsights({ categoryMonthlyComparison, entries, month, monthlyComparison }),
    [categoryMonthlyComparison, entries, month, monthlyComparison]
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>改善コメント</Text>
        <Text style={styles.subtitle}>保存済み会計データから、次に見直すポイントを表示します。</Text>
      </View>

      <View style={[styles.statusBox, errorMessage && styles.statusBoxError]}>
        <Text style={[styles.statusText, errorMessage && styles.statusTextError]}>{getStatusText({ errorMessage, isFallback, isLoading })}</Text>
        <Text style={styles.statusMeta}>
          対象月：{monthLabel} / 件数：{entries.length}件
        </Text>
      </View>

      {insights.length > 0 ? (
        <View style={styles.cardList}>
          {insights.map((insight) => (
            <AccountingInsightCard insight={insight} key={insight.id} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>まだ改善コメントを生成できません。</Text>
          <Text style={styles.emptySubtext}>売上・経費・家計データを入力すると、見直しポイントが表示されます。</Text>
        </View>
      )}
    </View>
  );
}

function getStatusText({
  errorMessage,
  isFallback,
  isLoading
}: {
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
}) {
  if (isLoading) {
    return "改善コメントを読み込み中...";
  }

  if (errorMessage) {
    return "改善コメントの読み込みに失敗しました。サンプルデータを表示しています。";
  }

  return isFallback ? "サンプルデータ表示中" : "保存済み会計データを反映中";
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    width: "100%"
  },
  header: {
    marginBottom: 10
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 5
  },
  statusBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  statusBoxError: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FED7AA"
  },
  statusText: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  statusTextError: {
    color: "#C2410C"
  },
  statusMeta: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 3
  },
  cardList: {
    gap: 10
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  emptyText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19
  },
  emptySubtext: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5
  }
});
