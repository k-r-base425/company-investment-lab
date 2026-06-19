import { StyleSheet, Text, View } from "react-native";

const summaryItems = [
  { label: "今月の売上", value: "¥2,450,000", tone: "#2563EB" },
  { label: "今月の経費", value: "¥1,320,000", tone: "#EA580C" },
  { label: "今月の利益", value: "¥1,130,000", tone: "#059669" },
  { label: "家計支出", value: "¥320,000", tone: "#0F766E" }
];

export function AccountingSummaryCards() {
  return (
    <View style={styles.grid}>
      {summaryItems.map((item) => (
        <View key={item.label} style={[styles.card, { borderColor: item.tone }]}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={[styles.value, { color: item.tone }]} adjustsFontSizeToFit numberOfLines={1}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    width: "100%"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 82,
    minWidth: 0,
    padding: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1
  },
  label: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0
  },
  value: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 25,
    marginTop: 8,
    minWidth: 0
  }
});
