import { StyleSheet, Text, View } from "react-native";

const indicators = [
  { label: "PER", text: "株価が利益の何倍まで買われているかを見る指標" },
  { label: "PBR", text: "株価が純資産の何倍まで買われているかを見る指標" },
  { label: "ROE", text: "自己資本を使ってどれだけ利益を出しているかを見る指標" },
  { label: "配当利回り", text: "投資額に対して年間配当がどれくらいあるかを見る指標" }
];

export function InvestmentIndicatorMemoCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>投資指標メモ</Text>
      <View style={styles.list}>
        {indicators.map((indicator) => (
          <View key={indicator.label} style={styles.row}>
            <Text style={styles.label}>{indicator.label}</Text>
            <Text style={styles.text}>{indicator.text}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>指標は単独で判断せず、業種・成長性・財務状態と合わせて確認します。</Text>
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
    padding: 14,
    width: "100%"
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12
  },
  list: {
    gap: 8
  },
  row: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  label: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  text: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 3
  },
  note: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderRadius: 8,
    borderWidth: 1,
    color: "#92400E",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 12,
    padding: 10
  }
});
