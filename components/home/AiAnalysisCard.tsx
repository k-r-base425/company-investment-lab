import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { buildAiAnalysisPrompt } from "../../lib/ai/buildAiAnalysisPrompt";
import { buildHomeAiAnalysisPayload } from "../../lib/ai/buildHomeAiAnalysisPayload";
import { createAiAnalysisRun } from "../../lib/ai/createAiAnalysisRun";
import { sampleAccountingEntries } from "../../lib/accounting/sampleAccountingEntries";
import { initAiAnalysisRunStorage, insertAiAnalysisRun } from "../../lib/storage/aiAnalysisRunRepository";
import { getAccountingEntriesByMonth, initAccountingStorage } from "../../lib/storage/accountingEntryRepository";

type CopyStatus = "idle" | "success" | "historyError" | "error";

const targetMonth = "2026-06";

export function AiAnalysisCard() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [accountingEntryCount, setAccountingEntryCount] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const clearStatusSoon = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setCopyStatus("idle");
      timerRef.current = null;
    }, 2500);
  };

  const handleCopy = async () => {
    try {
      await initAccountingStorage();
      const savedEntries = await getAccountingEntriesByMonth(targetMonth);
      const entries = savedEntries.length > 0 ? savedEntries : sampleAccountingEntries;
      const payload = buildHomeAiAnalysisPayload(entries, targetMonth);
      const prompt = buildAiAnalysisPrompt(payload);
      await Clipboard.setStringAsync(prompt);
      setAccountingEntryCount(entries.length);

      try {
        await initAiAnalysisRunStorage();
        await insertAiAnalysisRun(createAiAnalysisRun({ payload, period: targetMonth, promptText: prompt }));
        setCopyStatus("success");
      } catch {
        setCopyStatus("historyError");
      }
    } catch {
      setCopyStatus("error");
    } finally {
      clearStatusSoon();
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>AI READY FORMAT</Text>
          <Text style={styles.title}>AI分析用データ</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>JSON</Text>
        </View>
      </View>

      <Text style={styles.description}>
        現在の会計・家計・投資データを、AI分析に使える形式でコピーできます。
      </Text>

      <View style={styles.metaBox}>
        <InfoRow label="対象期間" value="2026年6月" />
        <InfoRow label="含まれるデータ" value="会計 / 家計 / 投資 / 学習 / 月グラフ" />
        <InfoRow
          label="会計入力データ"
          value={`保存済みデータを反映${accountingEntryCount === null ? "" : ` / ${accountingEntryCount}件`}`}
        />
        <InfoRow label="出力形式" value="分析依頼文 + JSON" />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleCopy}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>分析用データをコピー</Text>
      </Pressable>

      {copyStatus !== "idle" ? (
        <Text style={[styles.feedback, copyStatus !== "success" && styles.feedbackError]}>
          {getFeedbackMessage(copyStatus)}
        </Text>
      ) : null}
    </View>
  );
}

function getFeedbackMessage(status: CopyStatus) {
  switch (status) {
    case "success":
      return "コピーしました。履歴にも保存しました";
    case "historyError":
      return "コピーしました。履歴保存に失敗しました";
    case "error":
      return "コピーに失敗しました";
    default:
      return "";
  }
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C7D2FE",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 18,
    padding: 18,
    shadowColor: "#312E81",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
    width: "100%"
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    minWidth: 0
  },
  eyebrow: {
    color: "#6366F1",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    marginBottom: 4
  },
  title: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0
  },
  badge: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  badgeText: {
    color: "#4338CA",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0
  },
  description: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10
  },
  metaBox: {
    backgroundColor: "#F8FAFF",
    borderColor: "#E0E7FF",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 12,
    gap: 8
  },
  infoRow: {
    gap: 4
  },
  infoLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700"
  },
  infoValue: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  button: {
    alignItems: "center",
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    marginTop: 16,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 13
  },
  buttonPressed: {
    backgroundColor: "#4338CA",
    transform: [{ scale: 0.99 }]
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0
  },
  feedback: {
    color: "#047857",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center"
  },
  feedbackError: {
    color: "#B91C1C"
  }
});
