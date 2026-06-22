import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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

export function AiAnalysisHistorySection() {
  const { selectedMonth } = useSelectedMonth();
  const [runs, setRuns] = useState<AiAnalysisRun[]>([]);
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
      showFeedback("分析結果を保存しました");
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
      await Clipboard.setStringAsync(run.promptText);
      showFeedback("プロンプトをコピーしました");
    } catch {
      showFeedback("コピーに失敗しました", "error");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>AI分析履歴</Text>
          <Text style={styles.subtitle}>コピーした分析プロンプトと、AIから返ってきた回答を保存できます。</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{runs.length}件</Text>
        </View>
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
        runs={runs}
        selectedRunId={selectedRun?.id}
      />

      <AiAnalysisRunEditor onCancel={() => setSelectedRun(null)} onSave={handleSaveResponse} run={selectedRun} />
    </View>
  );
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
