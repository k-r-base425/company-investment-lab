import { Pressable, StyleSheet, Text, View } from "react-native";

type FilterOption<T extends string> = {
  label: string;
  value: T;
};

type LearningMemoFilterChipsProps<T extends string> = {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function LearningMemoFilterChips<T extends string>({
  label,
  onChange,
  options,
  value
}: LearningMemoFilterChipsProps<T>) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <Pressable
              accessibilityRole="button"
              key={option.value}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [styles.chip, isActive && styles.chipActive, pressed && styles.chipPressed]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
    width: "100%"
  },
  label: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
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
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  chipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#818CF8"
  },
  chipPressed: {
    opacity: 0.78
  },
  chipText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  chipTextActive: {
    color: "#3730A3"
  }
});
