import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  deleteInvestmentHolding,
  getInvestmentHoldings,
  initInvestmentHoldingStorage,
  insertInvestmentHolding,
  seedInvestmentHoldingsIfEmpty,
  updateInvestmentHolding
} from "../lib/storage/investmentHoldingRepository";
import type { InvestmentHolding, InvestmentHoldingMode } from "../lib/types/investment";

export default function InvestmentScreen() {
  const [holdings, setHoldings] = useState<InvestmentHolding[]>(sampleInvestmentHoldings);
  const [mode, setMode] = useState<InvestmentHoldingMode>("actual");
  const [editingHolding, setEditingHolding] = useState<InvestmentHolding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const summary = useMemo(() => calculateInvestmentSummary(holdings), [holdings]);
  const allocation = useMemo(() => buildInvestmentAllocation(holdings), [holdings]);
  const visibleHoldings = useMemo(() => filterInvestmentHoldingsByMode(holdings, mode), [holdings, mode]);

  useEffect(() => {
    let canceled = false;

    async function initializeStorage() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setIsFallback(false);
        await initInvestmentHoldingStorage();
        await seedInvestmentHoldingsIfEmpty(sampleInvestmentHoldings);
        const savedHoldings = await getInvestmentHoldings();

        if (!canceled) {
          setHoldings(savedHoldings);
        }
      } catch {
        if (!canceled) {
          setHoldings(sampleInvestmentHoldings);
          setIsFallback(true);
          setErrorMessage("投資データの読み込みに失敗しました。サンプル投資データを表示しています。");
        }
      } finally {
        if (!canceled) {
          setIsLoading(false);
        }
      }
    }

    initializeStorage();

    return () => {
      canceled = true;

      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  const reloadHoldings = async () => {
    const savedHoldings = await getInvestmentHoldings();
    setHoldings(savedHoldings);
    setIsFallback(false);
  };

  const showStatusMessage = (message: string) => {
    setStatusMessage(message);

    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    messageTimerRef.current = setTimeout(() => {
      setStatusMessage("");
      messageTimerRef.current = null;
    }, 2500);
  };

  const handleSubmitHolding = async (holding: InvestmentHolding) => {
    try {
      setErrorMessage("");

      if (editingHolding) {
        await updateInvestmentHolding(holding);
        setEditingHolding(null);
        await reloadHoldings();
        showStatusMessage("銘柄を更新しました");
        return true;
      }

      await insertInvestmentHolding(holding);
      await reloadHoldings();
      showStatusMessage("銘柄を追加しました");
      return true;
    } catch {
      setErrorMessage(editingHolding ? "銘柄の更新に失敗しました。" : "銘柄の保存に失敗しました。");
      return false;
    }
  };

  const handleEditHolding = (holding: InvestmentHolding) => {
    setErrorMessage("");
    setStatusMessage("");
    setEditingHolding(holding);
  };

  const handleCancelEdit = () => {
    setEditingHolding(null);
  };

  const handleDeleteHolding = async (id: string) => {
    try {
      setErrorMessage("");
      await deleteInvestmentHolding(id);
      if (editingHolding?.id === id) {
        setEditingHolding(null);
      }
      await reloadHoldings();
      showStatusMessage("銘柄を削除しました");
    } catch {
      setErrorMessage("銘柄の削除に失敗しました。");
    }
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

          <View style={styles.dataStatusBox}>
            <Text style={styles.dataStatusText}>
              {isLoading
                ? "投資データを読み込み中..."
                : isFallback
                  ? "サンプル投資データを表示中"
                  : "保存済み投資データを反映中"}
            </Text>
          </View>

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          {statusMessage ? <Text style={styles.successMessage}>{statusMessage}</Text> : null}

          <InvestmentSummaryCards summary={summary} />

          <InvestmentModeTabs mode={mode} onChange={setMode} />

          <InvestmentHoldingList holdings={visibleHoldings} onDelete={handleDeleteHolding} onEdit={handleEditHolding} />

          <InvestmentHoldingForm
            editingHolding={editingHolding}
            onAdd={handleSubmitHolding}
            onCancelEdit={handleCancelEdit}
            submitLabel={editingHolding ? "銘柄を更新" : "銘柄を追加"}
          />

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
  },
  dataStatusBox: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%"
  },
  dataStatusText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18
  },
  errorMessage: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 8,
    borderWidth: 1,
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 12,
    padding: 10,
    width: "100%"
  },
  successMessage: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#047857",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 18,
    marginTop: 12,
    padding: 10,
    width: "100%"
  }
});
