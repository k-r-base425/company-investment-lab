import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { buildAccountingBreakdowns } from "../../lib/accounting/buildAccountingBreakdowns";
import type { AccountingEntry } from "../../lib/types/accounting";
import { CategoryBreakdownCard } from "./CategoryBreakdownCard";
import { CostBehaviorCard } from "./CostBehaviorCard";
import { SpendingJudgementCard } from "./SpendingJudgementCard";

type AccountingAnalysisSectionProps = {
  entries: AccountingEntry[];
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
  month: string;
  monthLabel: string;
};

export function AccountingAnalysisSection({
  entries,
  errorMessage,
  isFallback,
  isLoading,
  month,
  monthLabel
}: AccountingAnalysisSectionProps) {
  const breakdowns = useMemo(() => buildAccountingBreakdowns(entries, month), [entries, month]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>カテゴリ分析</Text>
        <Text style={styles.subtitle}>保存済み会計データから、お金の流れを見える化します。</Text>
      </View>

      <View style={[styles.statusBox, errorMessage && styles.statusBoxError]}>
        <Text style={[styles.statusText, errorMessage && styles.statusTextError]}>{getStatusText({ errorMessage, isFallback, isLoading })}</Text>
        <Text style={styles.statusMeta}>
          対象月：{monthLabel} / 件数：{entries.length}件
        </Text>
      </View>

      <View style={styles.cardList}>
        <CategoryBreakdownCard
          emptyMessage="売上データがまだありません"
          items={breakdowns.revenueCategories}
          title="売上カテゴリ"
          tone="#059669"
        />
        <CategoryBreakdownCard
          emptyMessage="経費データがまだありません"
          items={breakdowns.expenseCategories}
          maxItems={5}
          memo="経費は増えすぎると利益を圧迫します。大きいカテゴリから見直しましょう。"
          title="経費ランキング"
          tone="#EA580C"
        />
        <CategoryBreakdownCard
          emptyMessage="家計データがまだありません"
          items={breakdowns.householdCategories}
          maxItems={5}
          memo="家計支出は投資可能額に直結します。固定化している支出を確認しましょう。"
          title="家計ランキング"
          tone="#0F766E"
        />
        <CostBehaviorCard breakdown={breakdowns.costBehaviorBreakdown} />
        <SpendingJudgementCard breakdown={breakdowns.judgementBreakdown} />
      </View>
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
    return "カテゴリ分析を読み込み中...";
  }

  if (errorMessage) {
    return "カテゴリ分析の読み込みに失敗しました。サンプルデータを表示しています。";
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
  }
});
