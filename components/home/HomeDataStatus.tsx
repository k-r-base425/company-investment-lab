import { Pressable, StyleSheet, Text, View } from "react-native";

type HomeDataStatusProps = {
  entryCount: number;
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
  monthLabel: string;
  onRefresh: () => void;
};

export function HomeDataStatus({
  entryCount,
  errorMessage,
  isFallback,
  isLoading,
  monthLabel,
  onRefresh
}: HomeDataStatusProps) {
  const title = getTitle({ errorMessage, isFallback, isLoading });
  const detail = isFallback ? `${monthLabel} / 入力データなし` : `${monthLabel} / ${entryCount}件`;

  return (
    <View style={[styles.card, errorMessage && styles.errorCard]}>
      <View style={styles.textWrap}>
        <Text style={[styles.title, errorMessage && styles.errorTitle]}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onRefresh} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>データを更新</Text>
      </Pressable>
    </View>
  );
}

function getTitle({
  errorMessage,
  isFallback,
  isLoading
}: {
  errorMessage?: string;
  isFallback: boolean;
  isLoading: boolean;
}) {
  if (isLoading) {
    return "会計データを読み込み中...";
  }

  if (errorMessage) {
    return errorMessage;
  }

  return isFallback ? "サンプルデータ表示中" : "保存済み会計データを反映中";
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 12,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%"
  },
  errorCard: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FED7AA"
  },
  textWrap: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  errorTitle: {
    color: "#C2410C"
  },
  detail: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    marginTop: 2
  },
  button: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  buttonPressed: {
    opacity: 0.78
  },
  buttonText: {
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "900"
  }
});
