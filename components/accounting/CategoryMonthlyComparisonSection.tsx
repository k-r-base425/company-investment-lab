import { StyleSheet, Text, View } from "react-native";

import type { CategoryMonthlyComparisonSummary } from "../../lib/types/categoryMonthlyComparison";
import { CategoryComparisonCard } from "./CategoryComparisonCard";

type CategoryMonthlyComparisonSectionProps = {
  comparison: CategoryMonthlyComparisonSummary;
  currentMonthLabel: string;
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
  previousMonthLabel: string;
};

export function CategoryMonthlyComparisonSection({
  comparison,
  currentMonthLabel,
  errorMessage,
  isFallback,
  isLoading,
  previousMonthLabel
}: CategoryMonthlyComparisonSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>カテゴリ別前月比</Text>
        <Text style={styles.subtitle}>前月から増えたカテゴリ・減ったカテゴリを確認します。</Text>
      </View>

      <View style={[styles.statusBox, errorMessage && styles.statusBoxError]}>
        <Text style={[styles.statusText, errorMessage && styles.statusTextError]}>
          {getStatusText({ comparison, errorMessage, isFallback, isLoading })}
        </Text>
        <Text style={styles.statusMeta}>
          対象月：{currentMonthLabel} / 前月：{previousMonthLabel}
        </Text>
      </View>

      {comparison.hasPreviousData ? (
        <View style={styles.cardList}>
          <CategoryComparisonCard
            emptyMessage="増加した経費カテゴリはありません"
            items={comparison.increasedExpenseCategories}
            memo="増加カテゴリは、継続的な支出か一時的な支出かを分けて確認しましょう。"
            title="経費 増加カテゴリ"
            tone="#EA580C"
          />
          <CategoryComparisonCard
            emptyMessage="減少した経費カテゴリはありません"
            items={comparison.decreasedExpenseCategories}
            title="経費 減少カテゴリ"
            tone="#059669"
          />
          <CategoryComparisonCard
            emptyMessage="増加した家計カテゴリはありません"
            items={comparison.increasedHouseholdCategories}
            memo="家計支出の増加は投資可能額に直結します。固定化していないか確認しましょう。"
            title="家計 増加カテゴリ"
            tone="#F97316"
          />
          <CategoryComparisonCard
            emptyMessage="減少した家計カテゴリはありません"
            items={comparison.decreasedHouseholdCategories}
            title="家計 減少カテゴリ"
            tone="#0F766E"
          />
          <CategoryComparisonCard
            emptyMessage="売上カテゴリの比較データがありません"
            items={comparison.revenueCategories}
            title="売上カテゴリ前月比"
            tone="#2563EB"
          />
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>前月データがまだありません。</Text>
          <Text style={styles.emptySubtext}>前月の入力があると、カテゴリごとの増減を確認できます。</Text>
        </View>
      )}
    </View>
  );
}

function getStatusText({
  comparison,
  errorMessage,
  isFallback,
  isLoading
}: {
  comparison: CategoryMonthlyComparisonSummary;
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
}) {
  if (isLoading) {
    return "カテゴリ別前月比を読み込み中...";
  }

  if (errorMessage) {
    return "カテゴリ別前月比の読み込みに失敗しました。";
  }

  if (!comparison.hasPreviousData) {
    return "前月データなし";
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
