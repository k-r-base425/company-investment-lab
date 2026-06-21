import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ImprovementAction, ImprovementActionPriority, ImprovementActionStatus } from "../../lib/types/improvementAction";

type ImprovementActionCardProps = {
  action: ImprovementAction;
  onDelete: (id: string) => void;
  onToggleStatus: (action: ImprovementAction) => void;
};

const statusLabels: Record<ImprovementActionStatus, string> = {
  todo: "未完了",
  done: "完了",
  deferred: "保留"
};

const priorityLabels: Record<ImprovementActionPriority, string> = {
  high: "高",
  medium: "中",
  low: "低"
};

const priorityColors: Record<ImprovementActionPriority, string> = {
  high: "#EA580C",
  medium: "#4F46E5",
  low: "#059669"
};

export function ImprovementActionCard({ action, onDelete, onToggleStatus }: ImprovementActionCardProps) {
  const priorityColor = priorityColors[action.priority];
  const isDone = action.status === "done";

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={styles.badgeRow}>
        <View style={[styles.statusBadge, isDone ? styles.statusBadgeDone : styles.statusBadgeTodo]}>
          <Text style={[styles.statusText, isDone ? styles.statusTextDone : styles.statusTextTodo]}>
            {statusLabels[action.status]}
          </Text>
        </View>
        <View style={[styles.priorityBadge, { borderColor: priorityColor, backgroundColor: `${priorityColor}12` }]}>
          <Text style={[styles.priorityText, { color: priorityColor }]}>優先度 {priorityLabels[action.priority]}</Text>
        </View>
      </View>

      <Text style={[styles.title, isDone && styles.doneText]}>{action.title}</Text>
      {action.description ? <Text style={styles.description}>{action.description}</Text> : null}

      <View style={styles.metaGrid}>
        <MetaItem label="カテゴリ" value={getCategoryLabel(action.category)} />
        <MetaItem label="元コメント" value={action.sourceInsightTitle ?? "手動 / その他"} />
        <MetaItem label="作成日" value={formatDateTime(action.createdAt)} />
        {action.completedAt ? <MetaItem label="完了日" value={formatDateTime(action.completedAt)} /> : null}
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onToggleStatus(action)}
          style={({ pressed }) => [styles.primaryButton, isDone && styles.undoButton, pressed && styles.buttonPressed]}
        >
          <Text style={[styles.primaryButtonText, isDone && styles.undoButtonText]}>
            {isDone ? "未完了に戻す" : "完了にする"}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onDelete(action.id)}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    profitability: "収益性",
    expense: "経費",
    household: "家計",
    fixed_cost: "固定費",
    waste: "浪費",
    investment: "投資",
    tax: "税金",
    cashflow: "資金繰り",
    data_quality: "入力品質",
    other: "その他"
  };

  return labels[category] ?? category;
}

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  cardDone: {
    backgroundColor: "#F8FAFC"
  },
  badgeRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minWidth: 0
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  statusBadgeTodo: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74"
  },
  statusBadgeDone: {
    backgroundColor: "#ECFDF5",
    borderColor: "#86EFAC"
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900"
  },
  statusTextTodo: {
    color: "#C2410C"
  },
  statusTextDone: {
    color: "#047857"
  },
  priorityBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "900"
  },
  title: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
    marginTop: 12
  },
  doneText: {
    color: "#64748B",
    textDecorationLine: "line-through"
  },
  description: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 6
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  metaItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexGrow: 1,
    minWidth: 122,
    padding: 9
  },
  metaLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800"
  },
  metaValue: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
    marginTop: 2
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 8,
    flexGrow: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  undoButton: {
    backgroundColor: "#E0F2FE"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  undoButtonText: {
    color: "#0369A1"
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  deleteButtonText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "900"
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
  }
});
