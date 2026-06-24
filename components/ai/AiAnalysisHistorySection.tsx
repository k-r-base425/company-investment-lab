import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { AiAnalysisRunEditor } from "./AiAnalysisRunEditor";
import { AiAnalysisRunList } from "./AiAnalysisRunList";
import { useSelectedMonth } from "../../contexts/SelectedMonthContext";
import {
  deleteAiAnalysisRun,
  getAiAnalysisRunsByPeriod,
  initAiAnalysisRunStorage,
  updateAiAnalysisRunResponse
} from "../../lib/storage/aiAnalysisRunRepository";
import type { AiAnalysisRun } from "../../lib/types/aiAnalysisRun";

type FeedbackTone = "error" | "success";
type HistoryFilter = "all" | "accounting" | "investment" | "holding" | "saved" | "pending";

const filterLabels: Record<HistoryFilter, string> = {
  all: "すべて",
  accounting: "会計",
  holding: "銘柄",
  investment: "投資",
  saved: "回答保存済み",
  pending: "回答未保存"
};
const copyTimeoutMs = 1800;

export function AiAnalysisHistorySection() {
  const { selectedMonth } = useSelectedMonth();
  const [runs, setRuns] = useState<AiAnalysisRun[]>([]);
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [selectedRun, setSelectedRun] = useState<AiAnalysisRun | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedback, setFeedback] = useState<{ message: string; tone: FeedbackTone } | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        await initAiAnalysisRunStorage();
        const savedRuns = await getAiAnalysisRunsByPeriod(selectedMonth);

        if (!canceled) {
          setRuns(savedRuns);
        }
      } catch {
        if (!canceled) {
          setErrorMessage("AI分析履歴の読み込みに失敗しました。");
        }
      } finally {
        if (!canceled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      canceled = true;

      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, [selectedMonth]);

  const reloadRuns = async () => {
    const savedRuns = await getAiAnalysisRunsByPeriod(selectedMonth);
    setRuns(savedRuns);
    setSelectedRun((currentRun) => {
      if (!currentRun) {
        return null;
      }

      return savedRuns.find((run) => run.id === currentRun.id) ?? null;
    });
  };

  const showFeedback = (message: string, tone: FeedbackTone = "success") => {
    setFeedback({ message, tone });

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
      feedbackTimerRef.current = null;
    }, 2500);
  };

  const handleSaveResponse = async ({
    memo,
    nextAction,
    responseText
  }: {
    memo?: string;
    nextAction?: string;
    responseText: string;
  }) => {
    if (!selectedRun) {
      return false;
    }

    try {
      setErrorMessage("");
      await updateAiAnalysisRunResponse({
        id: selectedRun.id,
        memo,
        nextAction,
        responseText
      });
      await reloadRuns();
      showFeedback(getSavedResponseMessage(selectedRun));
      return true;
    } catch {
      setErrorMessage("分析結果の保存に失敗しました。");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setErrorMessage("");
      await deleteAiAnalysisRun(id);
      if (selectedRun?.id === id) {
        setSelectedRun(null);
      }
      await reloadRuns();
      showFeedback("履歴を削除しました");
    } catch {
      setErrorMessage("履歴の削除に失敗しました。");
    }
  };

  const handleCopyPrompt = async (run: AiAnalysisRun) => {
    try {
      await copyTextWithTimeout(run.promptText);
      showFeedback("プロンプトをコピーしました");
    } catch {
      showFeedback("コピーに失敗しました", "error");
    }
  };

  const filteredRuns = runs.filter((run) => {
    if (filter === "all") {
      return true;
    }

    if (filter === "investment") {
      return isInvestmentRun(run) && !isInvestmentHoldingRun(run);
    }

    if (filter === "holding") {
      return isInvestmentHoldingRun(run);
    }

    if (filter === "accounting") {
      return !isInvestmentRun(run);
    }

    if (filter === "saved") {
      return run.status === "response_saved" || Boolean(run.responseText);
    }

    return run.status !== "response_saved" && !run.responseText;
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>AI分析履歴</Text>
          <Text style={styles.subtitle}>コピーした分析プロンプトと、AIから返ってきた回答を保存できます。</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filteredRuns.length}件</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {(Object.keys(filterLabels) as HistoryFilter[]).map((filterKey) => (
          <Pressable
            accessibilityRole="button"
            key={filterKey}
            onPress={() => setFilter(filterKey)}
            style={({ pressed }) => [
              styles.filterChip,
              filter === filterKey && styles.filterChipActive,
              pressed && styles.filterChipPressed
            ]}
          >
            <Text style={[styles.filterChipText, filter === filterKey && styles.filterChipTextActive]}>
              {filterLabels[filterKey]}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? <Text style={styles.statusMessage}>AI分析履歴を読み込んでいます...</Text> : null}
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {feedback ? (
        <Text style={[styles.feedbackMessage, feedback.tone === "error" && styles.feedbackError]}>{feedback.message}</Text>
      ) : null}

      <AiAnalysisRunList
        onCopyPrompt={handleCopyPrompt}
        onDelete={handleDelete}
        onSelect={setSelectedRun}
        runs={filteredRuns}
        selectedRunId={selectedRun?.id}
      />

      <AiAnalysisRunEditor onCancel={() => setSelectedRun(null)} onSave={handleSaveResponse} run={selectedRun} />
    </View>
  );
}

function isInvestmentRun(run: AiAnalysisRun) {
  return (
    run.theme === "investment_review" ||
    run.theme === "investment_holding_review" ||
    run.source === "investment_export" ||
    run.source === "investment_tab" ||
    run.source === "investment_holding_card"
  );
}

function isInvestmentHoldingRun(run: AiAnalysisRun) {
  return run.theme === "investment_holding_review" || run.source === "investment_holding_card";
}

function getSavedResponseMessage(run: AiAnalysisRun) {
  if (isInvestmentHoldingRun(run)) {
    return "銘柄分析結果を保存しました";
  }

  if (isInvestmentRun(run)) {
    return "投資分析結果を保存しました";
  }

  return "分析結果を保存しました";
}

async function copyTextWithTimeout(text: string) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  try {
    await Promise.race([
      Clipboard.setStringAsync(text),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Clipboard copy timed out"));
        }, copyTimeoutMs);
      })
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
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
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    minWidth: 0
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 17,
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
  countBadge: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  countText: {
    color: "#4338CA",
    fontSize: 12,
    fontWeight: "900"
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  filterChip: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  filterChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#818CF8"
  },
  filterChipPressed: {
    opacity: 0.75
  },
  filterChipText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900"
  },
  filterChipTextActive: {
    color: "#4338CA"
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
    textAlign: "center"
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
    textAlign: "center"
  },
  feedbackMessage: {
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
    textAlign: "center"
  },
  feedbackError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    color: "#B91C1C"
  }
});
