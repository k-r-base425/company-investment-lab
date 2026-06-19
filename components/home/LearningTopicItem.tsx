import { Pressable, StyleSheet, Text, View } from "react-native";

import type { LearningTopic } from "../../lib/types/learning";

type LearningTopicItemProps = {
  topic: LearningTopic;
};

const toneColors: Record<LearningTopic["accentTone"], { accent: string; soft: string; border: string }> = {
  blue: { accent: "#2563EB", soft: "#EFF6FF", border: "#BFDBFE" },
  green: { accent: "#059669", soft: "#ECFDF5", border: "#A7F3D0" },
  purple: { accent: "#7C3AED", soft: "#F5F3FF", border: "#DDD6FE" },
  orange: { accent: "#F97316", soft: "#FFF7ED", border: "#FDBA74" },
  teal: { accent: "#0F766E", soft: "#F0FDFA", border: "#99F6E4" }
};

export function LearningTopicItem({ topic }: LearningTopicItemProps) {
  const colors = toneColors[topic.accentTone];
  const progressPercent = Math.round(Math.min(Math.max(topic.progressRate, 0), 1) * 100);

  const handlePress = () => {
    // TODO: 学習ページ本体を作成したらExpo Routerで該当トピックへ遷移する。
    console.log(`Start learning topic: ${topic.id}`);
  };

  return (
    <View style={[styles.item, { borderColor: colors.border }]}>
      <View style={styles.metaRow}>
        <View style={[styles.categoryBadge, { backgroundColor: colors.soft }]}>
          <Text style={[styles.categoryText, { color: colors.accent }]}>{topic.category}</Text>
        </View>
        <View style={styles.metaPill}>
          <Text style={styles.metaPillText}>約{topic.estimatedMinutes}分</Text>
        </View>
        <View style={styles.metaPill}>
          <Text style={styles.metaPillText}>{topic.difficultyLabel}</Text>
        </View>
      </View>

      <Text style={styles.title}>{topic.title}</Text>
      <Text style={styles.description}>{topic.description}</Text>

      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>進捗</Text>
        <Text style={[styles.progressValue, { color: colors.accent }]}>{progressPercent}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.reasonBox}>
        <Text style={styles.reasonLabel}>推奨理由</Text>
        <Text style={styles.reasonText}>{topic.recommendationReason}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.accent },
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>学習を始める</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 10
  },
  categoryBadge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0
  },
  metaPill: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  metaPillText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "800"
  },
  title: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 22
  },
  description: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 7
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 13
  },
  progressLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800"
  },
  progressValue: {
    fontSize: 13,
    fontWeight: "900"
  },
  progressTrack: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    height: 8,
    marginTop: 7,
    overflow: "hidden",
    width: "100%"
  },
  progressFill: {
    borderRadius: 999,
    height: "100%"
  },
  reasonBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginTop: 13,
    padding: 10
  },
  reasonLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 4
  },
  reasonText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 13,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  }
});
