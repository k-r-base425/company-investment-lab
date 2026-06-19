import { StyleSheet, View } from "react-native";

import type { HomeKpi } from "../../lib/types/home";
import { KpiCard } from "./KpiCard";

type HomeKpiGridProps = {
  kpis: HomeKpi[];
};

export function HomeKpiGrid({ kpis }: HomeKpiGridProps) {
  return (
    <View style={styles.grid}>
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%"
  }
});
