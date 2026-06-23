import { Pressable, StyleSheet, Text, View } from "react-native";

type HomeInvestmentDataStatusProps = {
  holdingCount: number;
  isFallback: boolean;
  isLoading: boolean;
  errorMessage?: string;
  onRefresh?: () => void;
};

export function HomeInvestmentDataStatus({
  errorMessage,
  holdingCount,
  isFallback,
  isLoading,
  onRefresh
}: HomeInvestmentDataStatusProps) {
  const message = isLoading
    ? "投資データを読み込み中..."
    : isFallback
      ? "投資データ：サンプル表示中"
      : `投資データ：保存済み ${holdingCount}件`;

  return (
    <View style={[styles.box, errorMessage && styles.errorBox]}>
      <View style={styles.textWrap}>
        <Text style={[styles.statusText, errorMessage && styles.errorText]}>
          {errorMessage ? `${errorMessage} ${message}` : message}
        </Text>
      </View>
      {onRefresh ? (
        <Pressable accessibilityRole="button" onPress={onRefresh} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>更新</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 12,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%"
  },
  errorBox: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74"
  },
  textWrap: {
    flex: 1,
    minWidth: 0
  },
  statusText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18
  },
  errorText: {
    color: "#C2410C"
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  buttonPressed: {
    opacity: 0.72
  },
  buttonText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "900"
  }
});
