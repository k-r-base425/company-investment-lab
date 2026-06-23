import { StyleSheet, Text, View } from "react-native";

import {
  buildAccountingAnalysisJsonFileName,
  buildAccountingEntriesCsvFileName,
  buildAiAnalysisPromptTextFileName
} from "../../lib/export/buildExportFileNames";
import type { YearMonth } from "../../lib/types/month";

type AccountingExportSectionProps = {
  month: YearMonth;
  monthLabel: string;
};

export function AccountingExportSection({ month, monthLabel }: AccountingExportSectionProps) {
  const exportItems = [
    {
      label: "CSV",
      description: "会計入力一覧",
      fileName: buildAccountingEntriesCsvFileName(month)
    },
    {
      label: "JSON",
      description: "会計分析データ",
      fileName: buildAccountingAnalysisJsonFileName(month)
    },
    {
      label: "AI分析",
      description: "分析プロンプト",
      fileName: buildAiAnalysisPromptTextFileName(month)
    }
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>データ出力カード</Text>
          <Text style={styles.subtitle}>既存の出力機能は選択月を対象にします。</Text>
        </View>
        <Text style={styles.monthBadge}>{monthLabel}</Text>
      </View>

      <View style={styles.itemList}>
        {exportItems.map((item) => (
          <View key={item.label} style={styles.item}>
            <View style={styles.itemMain}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <Text style={styles.fileName}>{item.fileName}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.note}>
        実データや個人情報はGitHub Pages上で入力せず、サンプルデータで確認してください。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 12,
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
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 22
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  monthBadge: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#047857",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  itemList: {
    gap: 8,
    marginTop: 12
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  itemMain: {
    minWidth: 0
  },
  itemLabel: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  itemDescription: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 2
  },
  fileName: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16
  },
  note: {
    color: "#9A3412",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 10
  }
});
