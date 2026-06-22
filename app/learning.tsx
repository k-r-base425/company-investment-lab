import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AiAnalysisHistorySection } from "../components/ai/AiAnalysisHistorySection";
import { TodayLearningCard } from "../components/home/TodayLearningCard";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import { useSelectedMonth } from "../contexts/SelectedMonthContext";
import { sampleLearningTopics } from "../lib/home/sampleLearningTopics";

export default function LearningScreen() {
  const { selectedMonthLabel } = useSelectedMonth();

  return (
    <View style={styles.root}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.contentInner}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.kicker}>Account Invest Lab</Text>
              <Text style={styles.heading}>学習・AI分析</Text>
              <Text style={styles.subtitle}>学習テーマとAI分析履歴を確認する</Text>
            </View>
            <Text style={styles.monthLabel}>{selectedMonthLabel}</Text>
          </View>

          <TodayLearningCard topics={sampleLearningTopics} />

          <AiAnalysisHistorySection />
        </View>
      </ScrollView>
      <BottomTabBar activeTab="learning" />
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
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 18,
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
  monthLabel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 8
  }
});
