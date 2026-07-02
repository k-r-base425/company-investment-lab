import { StyleSheet, Text, View } from "react-native";

type LearningTopicCardProps = {
  title: string;
  category: "会計" | "投資" | "AI" | "簿記";
  description: string;
  relatedScreens: string[];
  learningPoints: string[];
  tone?: "blue" | "green" | "purple" | "orange" | "teal";
};

const toneStyles = {
  blue: {
    badge: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
    border: "#BFDBFE"
  },
  green: {
    badge: { backgroundColor: "#DCFCE7", color: "#166534" },
    border: "#BBF7D0"
  },
  orange: {
    badge: { backgroundColor: "#FFEDD5", color: "#C2410C" },
    border: "#FED7AA"
  },
  purple: {
    badge: { backgroundColor: "#F3E8FF", color: "#7E22CE" },
    border: "#D8B4FE"
  },
  teal: {
    badge: { backgroundColor: "#CCFBF1", color: "#0F766E" },
    border: "#99F6E4"
  }
} as const;

export function LearningTopicCard({
  title,
  category,
  description,
  relatedScreens,
  learningPoints,
  tone = "blue"
}: LearningTopicCardProps) {
  const style = toneStyles[tone];

  return (
    <View style={[styles.card, { borderColor: style.border }]}>
      <View style={styles.header}>
        <Text style={[styles.badge, style.badge]}>{category}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.metaBox}>
        <Text style={styles.metaLabel}>関連画面</Text>
        <Text style={styles.metaText}>{relatedScreens.join(" / ")}</Text>
      </View>

      <View style={styles.pointList}>
        <Text style={styles.pointTitle}>学習ポイント</Text>
        {learningPoints.map((point) => (
          <Text key={point} style={styles.pointText}>
            ・{point}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minWidth: 0
  },
  badge: {
    borderRadius: 999,
    flexShrink: 0,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  title: {
    color: "#0F172A",
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
    minWidth: 180
  },
  description: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8
  },
  metaBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginTop: 10,
    padding: 9
  },
  metaLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14
  },
  metaText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 2
  },
  pointList: {
    gap: 4,
    marginTop: 10
  },
  pointTitle: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  pointText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18
  }
});
