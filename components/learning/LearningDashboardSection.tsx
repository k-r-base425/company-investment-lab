import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { RecentLearningMemosCard } from "./RecentLearningMemosCard";
import { buildLearningMemoSummary } from "../../lib/learning/buildLearningMemoSummary";
import {
  getAiAnalysisRunsByPeriod,
  initAiAnalysisRunStorage
} from "../../lib/storage/aiAnalysisRunRepository";
import { getLearningMemos, initLearningMemoStorage } from "../../lib/storage/learningMemoRepository";
import type { AiAnalysisRun } from "../../lib/types/aiAnalysisRun";
import type { LearningMemo } from "../../lib/types/learningMemo";

type LearningDashboardSectionProps = {
  month: string;
  monthLabel: string;
  refreshKey?: number;
};

const recommendedTopics = [
  {
    title: "利益とキャッシュフローの違い",
    category: "会計",
    reason: "利益と投資可能額を正しく見るため"
  },
  {
    title: "PER / PBR / ROE",
    category: "投資",
    reason: "銘柄分析の基本指標を理解するため"
  },
  {
    title: "AI分析結果の見返し",
    category: "AI",
    reason: "分析結果を行動に変えるため"
  }
];

export function LearningDashboardSection({ month, monthLabel, refreshKey = 0 }: LearningDashboardSectionProps) {
  const [runs, setRuns] = useState<AiAnalysisRun[]>([]);
  const [memos, setMemos] = useState<LearningMemo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const memoSummary = useMemo(() => buildLearningMemoSummary(memos), [memos]);

  useEffect(() => {
    let canceled = false;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        await initAiAnalysisRunStorage();
        await initLearningMemoStorage();
        const [savedRuns, savedMemos] = await Promise.all([getAiAnalysisRunsByPeriod(month), getLearningMemos()]);

        if (!canceled) {
          setRuns(savedRuns);
          setMemos(savedMemos);
        }
      } catch {
        if (!canceled) {
          setRuns([]);
          setMemos([]);
          setErrorMessage("学習ダッシュボードのデータを読み込めませんでした。");
        }
      } finally {
        if (!canceled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      canceled = true;
    };
  }, [month, refreshKey]);

  const responseSavedCount = runs.filter((run) => run.status === "response_saved" || Boolean(run.responseText)).length;
  const responsePendingCount = Math.max(runs.length - responseSavedCount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>学習サマリー</Text>
        {isLoading ? <Text style={styles.statusText}>AI分析履歴を読み込んでいます...</Text> : null}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.summaryGrid}>
          <SummaryItem label="会計学習テーマ" value="5件" />
          <SummaryItem label="投資学習テーマ" value="5件" />
          <SummaryItem label="AI分析履歴" value={runs.length > 0 ? `${runs.length}件` : "まだありません"} />
          <SummaryItem label="回答保存済み" value={`${responseSavedCount}件`} />
          <SummaryItem label="回答未保存" value={`${responsePendingCount}件`} />
          <SummaryItem label="今月の対象月" value={monthLabel} />
        </View>
      </View>

      <View style={styles.recommendCard}>
        <Text style={styles.cardTitle}>今日のおすすめ学習</Text>
        <View style={styles.recommendList}>
          {recommendedTopics.map((topic) => (
            <View key={topic.title} style={styles.recommendItem}>
              <Text style={styles.topicCategory}>{topic.category}</Text>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicReason}>{topic.reason}</Text>
            </View>
          ))}
        </View>
      </View>

      <RecentLearningMemosCard summary={memoSummary} />
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: "100%"
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  recommendCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 22,
    marginBottom: 10
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  summaryItem: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 15
  },
  summaryValue: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20,
    marginTop: 4
  },
  statusText: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginBottom: 10,
    padding: 9
  },
  errorText: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 8,
    borderWidth: 1,
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginBottom: 10,
    padding: 9
  },
  recommendList: {
    gap: 9
  },
  recommendItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10
  },
  topicCategory: {
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16
  },
  topicTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 3
  },
  topicReason: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 3
  }
});
