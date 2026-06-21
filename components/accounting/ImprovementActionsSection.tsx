import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { buildImprovementActionsSummary, sortImprovementActions } from "../../lib/accounting/buildImprovementActionsSummary";
import type { ImprovementAction } from "../../lib/types/improvementAction";
import { ImprovementActionCard } from "./ImprovementActionCard";

type ImprovementActionFilter = "all" | "todo" | "done";

type ImprovementActionsSectionProps = {
  actions: ImprovementAction[];
  actionMessage?: string;
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
  monthLabel: string;
  period: string;
  onCreateFromInsights: () => void;
  onDelete: (id: string) => void;
  onToggleStatus: (action: ImprovementAction) => void;
};

const filterLabels: Record<ImprovementActionFilter, string> = {
  all: "すべて",
  todo: "未完了",
  done: "完了"
};

export function ImprovementActionsSection({
  actions,
  actionMessage,
  errorMessage,
  isFallback,
  isLoading,
  monthLabel,
  period,
  onCreateFromInsights,
  onDelete,
  onToggleStatus
}: ImprovementActionsSectionProps) {
  const [filter, setFilter] = useState<ImprovementActionFilter>("all");
  const summary = useMemo(() => buildImprovementActionsSummary(actions, period), [actions, period]);
  const filteredActions = useMemo(() => {
    const sortedActions = sortImprovementActions(actions.filter((action) => action.period === period));

    if (filter === "todo") {
      return sortedActions.filter((action) => action.status !== "done");
    }

    if (filter === "done") {
      return sortedActions.filter((action) => action.status === "done");
    }

    return sortedActions;
  }, [actions, filter, period]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>改善アクション</Text>
        <Text style={styles.subtitle}>改善コメントから、今月やることを管理します。</Text>
      </View>

      <View style={[styles.statusBox, errorMessage && styles.statusBoxError]}>
        <Text style={[styles.statusText, errorMessage && styles.statusTextError]}>{getStatusText({ errorMessage, isFallback, isLoading })}</Text>
        <Text style={styles.statusMeta}>
          対象月：{monthLabel} / 未完了：{summary.todoCount}件 / 完了：{summary.doneCount}件 / 合計：{summary.totalCount}件
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onCreateFromInsights}
        style={({ pressed }) => [styles.createButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.createButtonText}>改善コメントからアクションを作成</Text>
      </Pressable>

      {actionMessage ? <Text style={styles.actionMessage}>{actionMessage}</Text> : null}

      <View style={styles.filterRow}>
        {(Object.keys(filterLabels) as ImprovementActionFilter[]).map((filterKey) => (
          <Pressable
            accessibilityRole="button"
            key={filterKey}
            onPress={() => setFilter(filterKey)}
            style={[styles.filterButton, filter === filterKey && styles.filterButtonActive]}
          >
            <Text style={[styles.filterText, filter === filterKey && styles.filterTextActive]}>{filterLabels[filterKey]}</Text>
          </Pressable>
        ))}
      </View>

      {filteredActions.length > 0 ? (
        <View style={styles.cardList}>
          {filteredActions.map((action) => (
            <ImprovementActionCard
              action={action}
              key={action.id}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>改善アクションはまだありません。</Text>
          <Text style={styles.emptySubtext}>改善コメントから作成すると、未完了・完了で管理できます。</Text>
        </View>
      )}
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
    return "改善アクションを読み込み中...";
  }

  if (errorMessage) {
    return errorMessage;
  }

  return isFallback ? "サンプルデータ表示中の改善コメントから作成できます" : "保存済み改善アクションを反映中";
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
  createButton: {
    alignItems: "center",
    backgroundColor: "#4338CA",
    borderRadius: 8,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  actionMessage: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 9
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  filterButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  filterButtonActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB"
  },
  filterText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900"
  },
  filterTextActive: {
    color: "#1D4ED8"
  },
  cardList: {
    gap: 10,
    marginTop: 10
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
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
  },
  buttonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }]
  }
});
