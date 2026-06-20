import { StyleSheet, Text, View } from "react-native";

export type SegmentBreakdownItem = {
  color: string;
  label: string;
  value: number;
};

type SegmentBreakdownBarProps = {
  emptyMessage: string;
  items: SegmentBreakdownItem[];
};

export function SegmentBreakdownBar({ emptyMessage, items }: SegmentBreakdownBarProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total <= 0) {
    return <Text style={styles.emptyText}>{emptyMessage}</Text>;
  }

  return (
    <View>
      <View style={styles.segmentTrack}>
        {items.map((item) => (
          <View
            key={item.label}
            style={[
              styles.segment,
              {
                backgroundColor: item.color,
                flexGrow: Math.max(item.value, 0),
                flexBasis: 0
              }
            ]}
          />
        ))}
      </View>
      <View style={styles.list}>
        {items.map((item) => (
          <View key={item.label} style={styles.row}>
            <View style={styles.labelWrap}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <View style={styles.valueWrap}>
              <Text style={styles.amount}>{formatYen(item.value)}</Text>
              <Text style={styles.ratio}>{formatPercent(total > 0 ? item.value / total : 0)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function formatYen(value: number) {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

const styles = StyleSheet.create({
  segmentTrack: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    flexDirection: "row",
    height: 12,
    overflow: "hidden",
    width: "100%"
  },
  segment: {
    height: "100%"
  },
  list: {
    gap: 9,
    marginTop: 12
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0
  },
  labelWrap: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 7,
    minWidth: 0
  },
  dot: {
    borderRadius: 999,
    height: 8,
    width: 8
  },
  label: {
    color: "#0F172A",
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    minWidth: 0
  },
  valueWrap: {
    alignItems: "flex-end"
  },
  amount: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900"
  },
  ratio: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2
  },
  emptyText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19
  }
});
