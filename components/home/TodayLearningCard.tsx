import { Pressable, StyleSheet, Text, View } from "react-native";

import type { LearningTopic } from "../../lib/types/learning";
import { LearningTopicCard } from "./LearningTopicCard";

type TodayLearningCardProps = {
  topics: LearningTopic[];
};

export function TodayLearningCard({ topics }: TodayLearningCardProps) {
  const handleSeeAll = () => {
    // TODO: 学習一覧ページを作成したらExpo Routerで学習タブへ遷移する。
    console.log("Open all learning topics");
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>今日の学習</Text>
          <Text style={styles.subtitle}>実データとつなげて、数字の見方を鍛える</Text>
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
          <LearningTopicCard key={topic.id} topic={topic} />
        ))}
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
  }
});
