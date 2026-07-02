import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AiAnalysisHistorySection } from "../components/ai/AiAnalysisHistorySection";
import { CollapsibleSection } from "../components/common/CollapsibleSection";
import { BottomTabBar } from "../components/layout/BottomTabBar";
import { LearningDashboardSection } from "../components/learning/LearningDashboardSection";
import { LearningQuickNav } from "../components/learning/LearningQuickNav";
import type { LearningSectionKey } from "../components/learning/LearningQuickNav";
import { LearningTopicCard } from "../components/learning/LearningTopicCard";
import { useSelectedMonth } from "../contexts/SelectedMonthContext";

const accountingTopics = [
  {
    id: "profit-vs-cashflow",
    title: "利益とキャッシュフローの違い",
    category: "会計" as const,
    memoCategory: "accounting" as const,
    description: "利益が出ていても現金が不足する理由を学びます。",
    relatedScreens: ["ホームKPI", "投資可能額", "月比較"],
    learningPoints: [
      "利益と現金残高は一致しない",
      "税金・生活費・事業予備費を差し引いて投資余力を見る",
      "キャッシュフロー視点で行動を決める"
    ],
    tone: "blue" as const
  },
  {
    id: "fixed-assets-depreciation",
    title: "簿記2級：固定資産と減価償却",
    category: "簿記" as const,
    memoCategory: "bookkeeping" as const,
    description: "固定資産の取得、減価償却、決算整理を学びます。",
    relatedScreens: ["会計入力", "経費カテゴリ", "改善コメント"],
    learningPoints: [
      "支出と費用化のタイミングは異なる",
      "減価償却費は現金支出を伴わない費用",
      "設備投資の判断に使う"
    ],
    tone: "green" as const
  },
  {
    id: "expense-profit-margin",
    title: "経費率と利益率",
    category: "会計" as const,
    memoCategory: "accounting" as const,
    description: "売上に対して経費と利益がどれくらいあるかを確認します。",
    relatedScreens: ["ホームKPI", "前月比", "改善コメント"],
    learningPoints: [
      "経費率が高いと利益が残りにくい",
      "利益率は事業の収益性を見る入口",
      "前月比とカテゴリ分析を合わせて見る"
    ],
    tone: "orange" as const
  },
  {
    id: "journal-entry-basics",
    title: "仕訳の基本",
    category: "簿記" as const,
    memoCategory: "bookkeeping" as const,
    description: "借方・貸方の考え方と、取引を記録する基本を学びます。",
    relatedScreens: ["会計入力", "仕訳フォーム"],
    learningPoints: [
      "借方と貸方は必ず一致する",
      "取引は勘定科目で整理する",
      "簿記2級学習の土台になる"
    ],
    tone: "teal" as const
  },
  {
    id: "estimated-tax-investable",
    title: "税金目安と投資可能額",
    category: "会計" as const,
    memoCategory: "accounting" as const,
    description: "概算税額を差し引いたあとに、投資へ回せる余力を考えます。",
    relatedScreens: ["ホームKPI", "AI分析JSON", "改善効果"],
    learningPoints: [
      "税金目安は学習用の概算",
      "投資可能額は税引後で見る",
      "生活費と事業予備費を確保する"
    ],
    tone: "purple" as const
  }
];

const investmentTopics = [
  {
    id: "per-pbr-roe",
    title: "PER / PBR / ROE",
    category: "投資" as const,
    memoCategory: "investment" as const,
    description: "銘柄の株価指標と資本効率を確認します。",
    relatedScreens: ["投資タブ", "投資指標学習", "銘柄AI分析"],
    learningPoints: [
      "PERは利益に対する株価水準",
      "PBRは純資産に対する株価水準",
      "ROEは自己資本で利益を出す力",
      "単独ではなく業種比較が必要"
    ],
    tone: "green" as const
  },
  {
    id: "dividend-yield",
    title: "配当利回り",
    category: "投資" as const,
    memoCategory: "investment" as const,
    description: "投資額に対してどれくらい配当があるかを確認します。",
    relatedScreens: ["投資タブ", "投資データ出力"],
    learningPoints: [
      "高配当には減配リスクがある",
      "配当利回りだけで判断しない",
      "業績と配当方針を見る"
    ],
    tone: "orange" as const
  },
  {
    id: "cash-ratio-safety",
    title: "現金比率と安全余力",
    category: "投資" as const,
    memoCategory: "investment" as const,
    description: "現金比率から、投資余力と生活防衛資金のバランスを考えます。",
    relatedScreens: ["ホーム資産配分", "投資サマリー"],
    learningPoints: [
      "現金比率が低すぎると安全余力が下がる",
      "高すぎる場合は投資待機資金の意図を確認する",
      "事業資金と生活資金を分けて考える"
    ],
    tone: "teal" as const
  },
  {
    id: "actual-virtual-holdings",
    title: "実保有と仮想保有",
    category: "投資" as const,
    memoCategory: "investment" as const,
    description: "実際に持っている銘柄と、学習用に追う銘柄を分けて管理します。",
    relatedScreens: ["投資タブ", "銘柄AI分析"],
    learningPoints: [
      "仮想保有で値動きと指標を学べる",
      "実際に買う前に確認項目を整理できる",
      "学習と資金リスクを分けられる"
    ],
    tone: "purple" as const
  },
  {
    id: "holding-ai-analysis",
    title: "銘柄別AI分析",
    category: "AI" as const,
    memoCategory: "ai_analysis" as const,
    description: "1銘柄ずつAI分析用にコピーし、次に調べる情報を整理します。",
    relatedScreens: ["投資タブ", "AI分析履歴"],
    learningPoints: [
      "AIに判断させるのではなく、確認観点を出させる",
      "PER/PBR/ROE/配当利回りを深掘りする",
      "分析結果を履歴に保存して見返す"
    ],
    tone: "blue" as const
  }
];

const aiReviewTopic = {
  id: "ai-analysis-review",
  title: "AI分析結果の見返し",
  category: "AI" as const,
  memoCategory: "ai_analysis" as const,
  description: "AI分析結果から重要な気づきと次の行動を整理します。",
  relatedScreens: ["AI分析履歴", "ホームAI分析"],
  learningPoints: [
    "AIに判断させるのではなく、確認観点を整理する",
    "回答を保存して、次の行動に変換する",
    "学習メモとして残す言葉を選ぶ"
  ],
  tone: "blue" as const
};

export default function LearningScreen() {
  const { selectedMonth, selectedMonthLabel } = useSelectedMonth();
  const [memoRefreshKey, setMemoRefreshKey] = useState(0);
  const [openSections, setOpenSections] = useState<Record<LearningSectionKey, boolean>>({
    accounting: true,
    aiHistory: true,
    dashboard: true,
    investment: true
  });
  const sectionItems = [
    { key: "dashboard" as const, label: "概要", isOpen: openSections.dashboard },
    { key: "accounting" as const, label: "会計", isOpen: openSections.accounting },
    { key: "investment" as const, label: "投資", isOpen: openSections.investment },
    { key: "aiHistory" as const, label: "AI履歴", isOpen: openSections.aiHistory }
  ];

  const handleToggleSection = (key: LearningSectionKey) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const handleQuickNavSelect = (key: LearningSectionKey) => {
    setOpenSections((current) => ({
      ...current,
      [key]: true
    }));
  };

  const handleMemoChanged = () => {
    setMemoRefreshKey((current) => current + 1);
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.contentInner}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.kicker}>Account Invest Lab</Text>
              <Text style={styles.heading}>学習・AI分析</Text>
              <Text style={styles.subtitle}>会計・投資・AI分析履歴を見返して、数字の力を鍛える</Text>
            </View>
            <Text style={styles.monthLabel}>{selectedMonthLabel}</Text>
          </View>

          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              AI分析は学習・検討用です。判断を断定せず、次に確認する数字を整理します。
            </Text>
          </View>

          <LearningQuickNav items={sectionItems} onSelect={handleQuickNavSelect} />

          <CollapsibleSection
            badgeText="概要"
            isOpen={openSections.dashboard}
            onToggle={() => handleToggleSection("dashboard")}
            subtitle="今の学習状況とAI分析履歴を確認します。"
            title="学習ダッシュボード"
          >
            <LearningDashboardSection
              month={selectedMonth}
              monthLabel={selectedMonthLabel}
              refreshKey={memoRefreshKey}
            />
          </CollapsibleSection>

          <CollapsibleSection
            badgeText="5件"
            isOpen={openSections.accounting}
            onToggle={() => handleToggleSection("accounting")}
            subtitle="簿記2級・個人事業・経営判断に必要な数字を学びます。"
            title="会計学習"
          >
            <View style={styles.topicList}>
              {accountingTopics.map((topic) => (
                <LearningTopicCard
                  key={topic.id}
                  memoRefreshKey={memoRefreshKey}
                  onMemoChanged={handleMemoChanged}
                  {...topic}
                />
              ))}
            </View>
          </CollapsibleSection>

          <CollapsibleSection
            badgeText="5件"
            isOpen={openSections.investment}
            onToggle={() => handleToggleSection("investment")}
            subtitle="実保有・仮想保有・投資指標を使って銘柄を見る力を鍛えます。"
            title="投資学習"
          >
            <View style={styles.topicList}>
              {investmentTopics.map((topic) => (
                <LearningTopicCard
                  key={topic.id}
                  memoRefreshKey={memoRefreshKey}
                  onMemoChanged={handleMemoChanged}
                  {...topic}
                />
              ))}
            </View>
          </CollapsibleSection>

          <CollapsibleSection
            badgeText="履歴"
            isOpen={openSections.aiHistory}
            onToggle={() => handleToggleSection("aiHistory")}
            subtitle="会計分析・投資分析・銘柄分析のプロンプトと回答を見返します。"
            title="AI分析履歴"
          >
            <View style={styles.topicList}>
              <LearningTopicCard
                key={aiReviewTopic.id}
                memoRefreshKey={memoRefreshKey}
                onMemoChanged={handleMemoChanged}
                {...aiReviewTopic}
              />
            </View>
            <AiAnalysisHistorySection onLearningMemoSaved={handleMemoChanged} />
          </CollapsibleSection>
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
  },
  topicList: {
    gap: 12,
    width: "100%"
  }
});
