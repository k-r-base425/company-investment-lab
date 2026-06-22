import { Pressable, StyleSheet, Text, View } from "react-native";

import { useSelectedMonth } from "../../contexts/SelectedMonthContext";

export function MonthSelector() {
  const { goToNextMonth, goToPreviousMonth, resetToSampleMonth, selectedMonthLabel } = useSelectedMonth();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>対象月</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          onPress={goToPreviousMonth}
          style={({ pressed }) => [styles.arrowButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.arrowText}>{"<"}</Text>
        </Pressable>

        <View style={styles.monthPill}>
          <Text style={styles.monthText}>{selectedMonthLabel}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={goToNextMonth}
          style={({ pressed }) => [styles.arrowButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.arrowText}>{">"}</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={resetToSampleMonth}
        style={({ pressed }) => [styles.resetButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.resetText}>サンプル月へ戻る</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    marginBottom: 12,
    padding: 12,
    width: "100%"
  },
  label: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "900"
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minWidth: 0
  },
  arrowButton: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 44
  },
  arrowText: {
    color: "#1D4ED8",
    fontSize: 18,
    fontWeight: "900"
  },
  monthPill: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
    minWidth: 0,
    paddingHorizontal: 10
  },
  monthText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900"
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    borderColor: "#DDD6FE",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  resetText: {
    color: "#5B21B6",
    fontSize: 12,
    fontWeight: "900"
  },
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  }
});
