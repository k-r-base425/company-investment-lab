import { Pressable, StyleSheet, Text, View } from "react-native";

import type { LearningTopic } from "../../lib/types/learning";
import type { LearningMemo } from "../../lib/types/learningMemo";
import { LearningTopicItem } from "./LearningTopicItem";

type TodayLearningCardProps = {
  latestMemos?: LearningMemo[];
  topics: LearningTopic[];
};

export function TodayLearningCard({ latestMemos = [], topics }: TodayLearningCardProps) {
  const handleSeeAll = () => {
    // TODO: 学習一覧ページを作成したらExpo Routerで学習タブへ遷移する。
    console.log("Open all learning topics");
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>今日の学習</Text>
          <Text style={styles.subtitle}>今日の数字とつながるテーマ</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handleSeeAll}
          style={({ pressed }) => [styles.seeAllButton, pressed && styles.seeAllPressed]}
        >
          <Text style={styles.seeAllText}>すべて見る</Text>
        </Pressable>
      </View>

      <View style={styles.topicList}>
        {topics.map((topic) => (
          <LearningTopicItem key={topic.id} topic={topic} />
        ))}
      </View>

      <View style={styles.memoBox}>
        <Text style={styles.memoTitle}>最新メモ</Text>
        {latestMemos.length > 0 ? (
          <View style={styles.memoList}>
            {latestMemos.slice(0, 2).map((memo) => (
              <View key={memo.id} style={styles.memoItem}>
                <Text style={styles.memoTopic}>{memo.topicTitle}</Text>
                <Text style={styles.memoText}>{memo.title}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyMemoText}>学習メモを保存すると、ここに最近の気づきが表示されます。</Text>
        )}
      </View>
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
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
    width: "100%"
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5
  },
  seeAllButton: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  seeAllPressed: {
    opacity: 0.78
  },
  seeAllText: {
    color: "#1E3A8A",
    fontSize: 12,
    fontWeight: "900"
  },
  topicList: {
    gap: 12,
    marginTop: 16
  },
  memoBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 12
  },
  memoTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  memoList: {
    gap: 8,
    marginTop: 8
  },
  memoItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 9
  },
  memoTopic: {
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15
  },
  memoText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 2
  },
  emptyMemoText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 6
  }
});
