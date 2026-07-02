import { Pressable, StyleSheet, Text, View } from "react-native";

export type LearningSectionKey = "dashboard" | "memoSearch" | "accounting" | "investment" | "aiHistory";

export type LearningQuickNavItem = {
  key: LearningSectionKey;
  label: string;
  isOpen: boolean;
};

type LearningQuickNavProps = {
  items: LearningQuickNavItem[];
  onSelect: (key: LearningSectionKey) => void;
};

export function LearningQuickNav({ items, onSelect }: LearningQuickNavProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>学習クイックナビ</Text>
      <View style={styles.chipRow}>
        {items.map((item) => (
          <Pressable
            accessibilityRole="button"
            key={item.key}
            onPress={() => onSelect(item.key)}
            style={({ pressed }) => [styles.chip, item.isOpen && styles.chipActive, pressed && styles.chipPressed]}
          >
            <Text style={[styles.chipText, item.isOpen && styles.chipTextActive]}>{item.label}</Text>
          </Pressable>
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
    marginTop: 14,
    padding: 12,
    width: "100%"
  },
  title: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 17,
    marginBottom: 10
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minWidth: 0
  },
  chip: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  chipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#818CF8"
  },
  chipPressed: {
    opacity: 0.8
  },
  chipText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  chipTextActive: {
    color: "#3730A3"
  }
});
