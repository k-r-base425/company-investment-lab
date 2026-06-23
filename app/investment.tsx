import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { InvestmentAllocationCard } from "../components/investment/InvestmentAllocationCard";
import { InvestmentHoldingForm } from "../components/investment/InvestmentHoldingForm";
import { InvestmentHoldingList } from "../components/investment/InvestmentHoldingList";
import { InvestmentIndicatorMemoCard } from "../components/investment/InvestmentIndicatorMemoCard";
import { InvestmentModeTabs } from "../components/investment/InvestmentModeTabs";
import { InvestmentSummaryCards } from "../components/investment/InvestmentSummaryCards";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import {
  buildInvestmentAllocation,
  calculateInvestmentSummary,
  filterInvestmentHoldingsByMode
} from "../lib/investment/calculateInvestment";
import { sampleInvestmentHoldings } from "../lib/investment/sampleInvestmentHoldings";
import type { InvestmentHolding, InvestmentHoldingMode } from "../lib/types/investment";

export default function InvestmentScreen() {
  const [holdings, setHoldings] = useState<InvestmentHolding[]>(sampleInvestmentHoldings);
  const [mode, setMode] = useState<InvestmentHoldingMode>("actual");
  const summary = useMemo(() => calculateInvestmentSummary(holdings), [holdings]);
  const allocation = useMemo(() => buildInvestmentAllocation(holdings), [holdings]);
  const visibleHoldings = useMemo(() => filterInvestmentHoldingsByMode(holdings, mode), [holdings, mode]);

  const handleAddHolding = (holding: InvestmentHolding) => {
    setHoldings((current) => [holding, ...current]);
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.contentInner}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.kicker}>Account Invest Lab</Text>
              <Text style={styles.heading}>投資管理</Text>
              <Text style={styles.subtitle}>実保有・仮想保有・投資指標を確認する</Text>
            </View>
          </View>

          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              この画面の株価・投資指標は手入力またはサンプルです。投資判断は複数の情報を確認して行います。
            </Text>
          </View>

          <InvestmentSummaryCards summary={summary} />

          <InvestmentModeTabs mode={mode} onChange={setMode} />

          <InvestmentHoldingList holdings={visibleHoldings} />

          <InvestmentHoldingForm onAdd={handleAddHolding} />

          <InvestmentIndicatorMemoCard />

          <InvestmentAllocationCard allocation={allocation} />
        </View>
      </ScrollView>
      <BottomTabBar activeTab="investment" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#F6F8FC",
    flex: 1,
    width: "100%"
  },
  screen: {
    backgroundColor: "#F6F8FC",
    flex: 1
  },
  content: {
    alignItems: "center",
    paddingBottom: 132,
    paddingHorizontal: 16,
    paddingTop: 50
  },
  contentInner: {
    alignSelf: "center",
    maxWidth: 430,
    minWidth: 0,
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    minWidth: 0
  },
  headerText: {
    flex: 1,
    minWidth: 0
  },
  kicker: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    marginBottom: 4
  },
  heading: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 6
  },
  noticeBox: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 12,
    width: "100%"
  },
  noticeText: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 19
  }
});
