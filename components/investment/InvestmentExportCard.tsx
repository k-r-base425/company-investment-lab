import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import { buildInvestmentCsv } from "../../lib/export/buildInvestmentCsv";
import {
  buildInvestmentAiPromptTextFileName,
  buildInvestmentAnalysisJsonFileName,
  buildInvestmentHoldingsCsvFileName
} from "../../lib/export/buildExportFileNames";
import { buildInvestmentJson } from "../../lib/export/buildInvestmentJson";
import { buildInvestmentPromptText } from "../../lib/export/buildInvestmentPromptText";
import { exportTextFile } from "../../lib/export/exportFiles";
import { buildAiAnalysisRunsSummary } from "../../lib/ai/buildAiAnalysisRunsSummary";
import { createInvestmentAiAnalysisRun } from "../../lib/ai/createInvestmentAiAnalysisRun";
import type { InvestmentAnalysisDataSource } from "../../lib/investment/buildInvestmentAnalysisPayload";
import {
  getAiAnalysisRunsByPeriod,
  initAiAnalysisRunStorage,
  insertAiAnalysisRun
} from "../../lib/storage/aiAnalysisRunRepository";
import type { InvestmentHolding } from "../../lib/types/investment";
import type { YearMonth } from "../../lib/types/month";

type InvestmentExportCardProps = {
  holdings: InvestmentHolding[];
  month: YearMonth;
  monthLabel: string;
  dataSource: InvestmentAnalysisDataSource;
};

type ExportStatus = "idle" | "success" | "error";

const copyTimeoutMs = 1800;

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

export function InvestmentExportCard({ dataSource, holdings, month, monthLabel }: InvestmentExportCardProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ExportStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showMessage = (nextMessage: string, nextStatus: ExportStatus) => {
    setMessage(nextMessage);
    setStatus(nextStatus);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setMessage("");
      setStatus("idle");
      timerRef.current = null;
    }, 2500);
  };

  const handleExportCsv = async () => {
    try {
      await exportTextFile({
        content: buildInvestmentCsv(holdings),
        fileName: buildInvestmentHoldingsCsvFileName(month),
        mimeType: "text/csv;charset=utf-8"
      });
      showMessage("CSVを出力しました", "success");
    } catch {
      showMessage("出力に失敗しました", "error");
    }
  };

  const handleExportJson = async () => {
    try {
      const aiAnalysisRunsSummary = await loadAiAnalysisRunsSummary();

      await exportTextFile({
        content: buildInvestmentJson({ aiAnalysisRunsSummary, dataSource, holdings, period: month }),
        fileName: buildInvestmentAnalysisJsonFileName(month),
        mimeType: "application/json;charset=utf-8"
      });
      showMessage("JSONを出力しました", "success");
    } catch {
      showMessage("出力に失敗しました", "error");
    }
  };

  const buildPrompt = () =>
    buildInvestmentPromptText({
      dataSource,
      holdings,
      monthLabel,
      period: month
    });

  const saveAnalysisRun = async (promptText: string, source: "investment_export" | "investment_tab") => {
    await initAiAnalysisRunStorage();
    await insertAiAnalysisRun(
      createInvestmentAiAnalysisRun({
        dataSource,
        holdings,
        period: month,
        promptText,
        source,
        title: `${monthLabel} 投資AI分析`
      })
    );
  };

  const loadAiAnalysisRunsSummary = async () => {
    try {
      await initAiAnalysisRunStorage();
      return buildAiAnalysisRunsSummary(await getAiAnalysisRunsByPeriod(month));
    } catch {
      return buildAiAnalysisRunsSummary([]);
    }
  };

  const handleExportPrompt = async () => {
    try {
      const promptText = buildPrompt();

      await exportTextFile({
        content: promptText,
        fileName: buildInvestmentAiPromptTextFileName(month),
        mimeType: "text/plain;charset=utf-8"
      });

      try {
        await saveAnalysisRun(promptText, "investment_export");
        showMessage("AI分析プロンプトを出力し、履歴にも保存しました", "success");
      } catch {
        showMessage("AI分析プロンプトを出力しました。履歴保存に失敗しました", "error");
      }
    } catch {
      showMessage("出力に失敗しました", "error");
    }
  };

  const handleCopyPrompt = async () => {
    try {
      const promptText = buildPrompt();

      await copyTextWithTimeout(promptText);

      try {
        await saveAnalysisRun(promptText, "investment_tab");
        showMessage("AI分析プロンプトをコピーし、履歴にも保存しました", "success");
      } catch {
        showMessage("AI分析プロンプトをコピーしました。履歴保存に失敗しました", "error");
      }
    } catch {
      showMessage("コピーに失敗しました", "error");
    }
  };

  const handleSaveToHistory = async () => {
    try {
      await saveAnalysisRun(buildPrompt(), "investment_tab");
      showMessage("投資AI分析を履歴に保存しました", "success");
    } catch {
      showMessage("履歴保存に失敗しました", "error");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>投資データ出力</Text>
          <Text style={styles.subtitle}>保存済みの投資データをCSV / JSON / AI分析用テキストで出力できます。</Text>
        </View>
        <Text style={styles.monthBadge}>{monthLabel}</Text>
      </View>

      <View style={styles.metaGrid}>
        <MetaPill label="対象月" value={monthLabel} />
        <MetaPill label="銘柄数" value={`${holdings.length}件`} />
        <MetaPill label="出力形式" value="CSV / JSON / AI分析プロンプト" wide />
      </View>

      <View style={styles.buttonGrid}>
        <ExportButton label="CSVを出力" onPress={handleExportCsv} />
        <ExportButton label="JSONを出力" onPress={handleExportJson} />
        <ExportButton label="AI分析プロンプトを出力" onPress={handleExportPrompt} />
        <ExportButton label="AI分析プロンプトをコピー" onPress={handleCopyPrompt} secondary />
        <ExportButton label="AI分析履歴へ保存" onPress={handleSaveToHistory} secondary />
      </View>

      {message ? (
        <Text style={[styles.message, status === "error" && styles.errorMessage]}>{message}</Text>
      ) : null}

      <Text style={styles.note}>
        出力データには投資情報が含まれる可能性があります。取り扱いに注意してください。
      </Text>
    </View>
  );
}

type MetaPillProps = {
  label: string;
  value: string;
  wide?: boolean;
};

function MetaPill({ label, value, wide }: MetaPillProps) {
  return (
    <View style={[styles.metaPill, wide && styles.metaPillWide]}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

type ExportButtonProps = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
};

function ExportButton({ label, onPress, secondary }: ExportButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondaryButton, pressed && styles.buttonPressed]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 14,
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  monthBadge: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderRadius: 8,
    borderWidth: 1,
    color: "#4338CA",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  metaPill: {
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
  metaPillWide: {
    flexBasis: "100%"
  },
  metaLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 15
  },
  metaValue: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 2
  },
  buttonGrid: {
    gap: 8,
    marginTop: 12
  },
  button: {
    alignItems: "center",
    backgroundColor: "#1D4ED8",
    borderRadius: 8,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%"
  },
  secondaryButton: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderWidth: 1
  },
  buttonPressed: {
    opacity: 0.75
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    textAlign: "center"
  },
  secondaryButtonText: {
    color: "#4338CA"
  },
  message: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#047857",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 12,
    padding: 10
  },
  errorMessage: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    color: "#B91C1C"
  },
  note: {
    color: "#9A3412",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 10
  }
});
