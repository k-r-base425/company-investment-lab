import { StyleSheet, View } from "react-native";

import type { AssetAllocationItem } from "../../lib/types/asset";

type AssetAllocationBarProps = {
  items: AssetAllocationItem[];
};

export const assetToneColors: Record<AssetAllocationItem["colorTone"], string> = {
  blue: "#2563EB",
  green: "#059669",
  purple: "#7C3AED",
  orange: "#F97316",
  teal: "#0F766E"
};

export function AssetAllocationBar({ items }: AssetAllocationBarProps) {
  const totalRatio = items.reduce((sum, item) => sum + Math.max(item.ratio, 0), 0);

  return (
    <View style={styles.track}>
      {items.map((item) => {
        const width = totalRatio > 0 ? (Math.max(item.ratio, 0) / totalRatio) * 100 : 0;
        return (
          <View
            key={item.id}
            style={[
              styles.segment,
              {
                backgroundColor: assetToneColors[item.colorTone],
                width: `${width}%`
              }
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    flexDirection: "row",
    height: 16,
    overflow: "hidden",
    width: "100%"
  },
  segment: {
    height: "100%"
  }
});
