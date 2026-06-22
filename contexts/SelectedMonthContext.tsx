import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import {
  defaultSelectedMonth,
  formatYearMonthLabel,
  getNextMonth,
  getPreviousMonth,
  normalizeYearMonth
} from "../lib/month/monthUtils";
import type { YearMonth } from "../lib/types/month";

type SelectedMonthContextValue = {
  selectedMonth: YearMonth;
  selectedMonthLabel: string;
  setSelectedMonth: (month: YearMonth) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  resetToSampleMonth: () => void;
};

const storageKey = "company-investment-lab:selected_month:v1";
const SelectedMonthContext = createContext<SelectedMonthContextValue | null>(null);

export function SelectedMonthProvider({ children }: PropsWithChildren) {
  const [selectedMonth, setSelectedMonthState] = useState<YearMonth>(() => readStoredMonth() ?? defaultSelectedMonth);

  useEffect(() => {
    writeStoredMonth(selectedMonth);
  }, [selectedMonth]);

  const value = useMemo<SelectedMonthContextValue>(
    () => ({
      selectedMonth,
      selectedMonthLabel: formatYearMonthLabel(selectedMonth),
      setSelectedMonth: (month) => {
        setSelectedMonthState(normalizeYearMonth(month) ?? defaultSelectedMonth);
      },
      goToPreviousMonth: () => {
        setSelectedMonthState((currentMonth) => getPreviousMonth(currentMonth));
      },
      goToNextMonth: () => {
        setSelectedMonthState((currentMonth) => getNextMonth(currentMonth));
      },
      resetToSampleMonth: () => {
        setSelectedMonthState(defaultSelectedMonth);
      }
    }),
    [selectedMonth]
  );

  return <SelectedMonthContext.Provider value={value}>{children}</SelectedMonthContext.Provider>;
}

export function useSelectedMonth() {
  const context = useContext(SelectedMonthContext);

  if (!context) {
    throw new Error("useSelectedMonth must be used within SelectedMonthProvider.");
  }

  return context;
}

function readStoredMonth(): YearMonth | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const storedValue = globalThis.localStorage.getItem(storageKey);
    return storedValue ? normalizeYearMonth(storedValue) : null;
  } catch {
    return null;
  }
}

function writeStoredMonth(month: YearMonth) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    globalThis.localStorage.setItem(storageKey, month);
  } catch {
    // Ignore persistence failures; in-memory state still works.
  }
}

function canUseLocalStorage() {
  return typeof globalThis.localStorage !== "undefined";
}
