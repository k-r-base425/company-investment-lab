import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AiAnalysisRun } from "../../lib/types/aiAnalysisRun";

type AiAnalysisRunListProps = {
  onCopyPrompt: (run: AiAnalysisRun) => void;
  onDelete: (id: string) => void;
  onSelect: (run: AiAnalysisRun) => void;
  runs: AiAnalysisRun[];
  selectedRunId?: string | null;
};

const statusLabels: Record<AiAnalysisRun["status"], string> = {
  prompt_created: "プロンプト作成",
  prompt_copied: "プロンプトコピー済み",
  response_saved: "回答保存済み"
};

const themeLabels: Record<AiAnalysisRun["theme"], string> = {
  monthly_review: "月次レビュー",
  business_profitability: "収益性",
  household_review: "家計",
  investment_holding_review: "銘柄分析",
  investment_review: "投資分析",
  learning_review: "学習",
  custom: "カスタム"
};

const sourceLabels: Record<AiAnalysisRun["source"], string> = {
  home_ai_card: "ホームAI",
  accounting_export: "会計出力",
  investment_export: "投資出力",
  investment_holding_card: "銘柄カード",
  investment_tab: "投資タブ",
  manual: "手動"
};

export function AiAnalysisRunList({ onCopyPrompt, onDelete, onSelect, runs, selectedRunId }: AiAnalysisRunListProps) {
  if (runs.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>まだAI分析履歴はありません</Text>
        <Text style={styles.emptyText}>ホーム画面でAI分析用データをコピーすると、ここに履歴が保存されます。</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {runs.map((run) => {
        const selected = run.id === selectedRunId;
        return (
          <View key={run.id} style={[styles.item, selected && styles.itemSelected]}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleWrap}>
                <Text style={styles.itemTitle}>{run.title}</Text>
                <Text style={styles.itemMeta}>
                  {run.period} / {formatDateTime(run.createdAt)}
                </Text>
              </View>
              <View style={[styles.statusBadge, run.status === "response_saved" && styles.statusBadgeSaved]}>
                <Text style={[styles.statusText, run.status === "response_saved" && styles.statusTextSaved]}>
                  {statusLabels[run.status]}
                </Text>
              </View>
            </View>

            <View style={styles.detailGrid}>
              <InfoChip label="種別" value={getRunCategoryLabel(run)} accent={isInvestmentRun(run)} />
              <InfoChip label="テーマ" value={themeLabels[run.theme] ?? run.theme} />
              <InfoChip label="source" value={sourceLabels[run.source] ?? run.source} />
              <InfoChip label="回答" value={run.responseText ? "回答保存済み" : "回答未保存"} />
            </View>

            <View style={styles.actionRow}>
              <ActionButton label={run.responseText ? "編集" : "回答を保存"} onPress={() => onSelect(run)} tone="primary" />
              <ActionButton label="プロンプトを再コピー" onPress={() => onCopyPrompt(run)} tone="neutral" />
              <ActionButton label="削除" onPress={() => onDelete(run.id)} tone="danger" />
            </View>
          </View>
        );
      })}
    </View>
  );
}

type InfoChipProps = {
  accent?: boolean;
  label: string;
  value: string;
};

function InfoChip({ accent, label, value }: InfoChipProps) {
  return (
    <View style={[styles.infoChip, accent && styles.infoChipAccent]}>
      <Text style={[styles.infoLabel, accent && styles.infoLabelAccent]}>{label}</Text>
      <Text style={[styles.infoValue, accent && styles.infoValueAccent]}>{value}</Text>
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  tone: "danger" | "neutral" | "primary";
};

function ActionButton({ label, onPress, tone }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        tone === "primary" && styles.actionButtonPrimary,
        tone === "danger" && styles.actionButtonDanger,
        pressed && styles.actionButtonPressed
      ]}
    >
      <Text
        style={[
          styles.actionText,
          tone === "primary" && styles.actionTextPrimary,
          tone === "danger" && styles.actionTextDanger
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
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

function getRunCategoryLabel(run: AiAnalysisRun) {
  if (run.theme === "investment_holding_review" || run.source === "investment_holding_card") {
    return "銘柄分析";
  }

  if (run.theme === "investment_review" || run.source === "investment_export" || run.source === "investment_tab") {
    return "投資分析";
  }

  if (run.theme === "learning_review") {
    return "学習";
  }

  if (
    run.theme === "monthly_review" ||
    run.theme === "business_profitability" ||
    run.theme === "household_review" ||
    run.source === "accounting_export" ||
    run.source === "home_ai_card"
  ) {
    return "会計分析";
  }

  return "その他";
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    marginTop: 14
  },
  emptyBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 14
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900"
  },
  emptyText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 6
  },
  item: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12
  },
  itemSelected: {
    borderColor: "#818CF8"
  },
  itemHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0
  },
  itemTitleWrap: {
    flex: 1,
    minWidth: 0
  },
  itemTitle: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20
  },
  itemMeta: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 3
  },
  statusBadge: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  statusBadgeSaved: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0"
  },
  statusText: {
    color: "#4338CA",
    fontSize: 11,
    fontWeight: "900"
  },
  statusTextSaved: {
    color: "#047857"
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  infoChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 7
  },
  infoChipAccent: {
    backgroundColor: "#F5F3FF",
    borderColor: "#C4B5FD"
  },
  infoLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "900"
  },
  infoLabelAccent: {
    color: "#7C3AED"
  },
  infoValue: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2
  },
  infoValueAccent: {
    color: "#5B21B6"
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  actionButtonPrimary: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB"
  },
  actionButtonDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA"
  },
  actionButtonPressed: {
    opacity: 0.78
  },
  actionText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900"
  },
  actionTextPrimary: {
    color: "#FFFFFF"
  },
  actionTextDanger: {
    color: "#B91C1C"
  }
});
