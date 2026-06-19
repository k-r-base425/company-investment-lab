import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { accountingTypeTones, journalAccountOptions } from "../../lib/accounting/accountingOptions";
import type { AccountingEntry } from "../../lib/types/accounting";

type JournalEntryFormProps = {
  onAdd: (entry: AccountingEntry) => void;
};

export function JournalEntryForm({ onAdd }: JournalEntryFormProps) {
  const [date, setDate] = useState("2026-06-05");
  const [debitAccount, setDebitAccount] = useState("消耗品費");
  const [debitAmount, setDebitAmount] = useState("");
  const [creditAccount, setCreditAccount] = useState("現金");
  const [creditAmount, setCreditAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");

  const tone = accountingTypeTones.journal;
  const numericDebit = Number(debitAmount.replace(/,/g, ""));
  const numericCredit = Number(creditAmount.replace(/,/g, ""));
  const amountsAreValid = Number.isFinite(numericDebit) && Number.isFinite(numericCredit) && numericDebit > 0 && numericCredit > 0;
  const balanced = amountsAreValid && numericDebit === numericCredit;

  const handleSubmit = () => {
    if (!date.trim() || !debitAccount || !debitAmount.trim() || !creditAccount || !creditAmount.trim() || !memo.trim()) {
      setError("日付、勘定科目、借方金額、貸方金額、摘要メモを入力してください。");
      return;
    }

    if (!amountsAreValid) {
      setError("借方金額と貸方金額は1以上の数値で入力してください。");
      return;
    }

    if (!balanced) {
      setError("借方・貸方の金額が一致していません。");
      return;
    }

    onAdd({
      id: `journal-${Date.now()}`,
      type: "journal",
      date: date.trim(),
      amount: numericDebit,
      memo: memo.trim(),
      debitAccount,
      debitAmount: numericDebit,
      creditAccount,
      creditAmount: numericCredit
    });

    setDate("2026-06-05");
    setDebitAccount("消耗品費");
    setDebitAmount("");
    setCreditAccount("現金");
    setCreditAmount("");
    setMemo("");
    setError("");
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>仕訳を入力</Text>
        <View style={[styles.typeBadge, { backgroundColor: tone }]}>
          <Text style={styles.typeBadgeText}>仕訳</Text>
        </View>
      </View>

      <Field label="日付">
        <TextInput
          inputMode="text"
          onChangeText={setDate}
          placeholder="yyyy-mm-dd"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={date}
        />
      </Field>

      <OptionGroup label="借方勘定科目" options={journalAccountOptions} selected={debitAccount} onSelect={setDebitAccount} tone={tone} />

      <Field label="借方金額">
        <TextInput
          inputMode="numeric"
          onChangeText={setDebitAmount}
          placeholder="例：8000"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={debitAmount}
        />
      </Field>

      <OptionGroup label="貸方勘定科目" options={journalAccountOptions} selected={creditAccount} onSelect={setCreditAccount} tone={tone} />

      <Field label="貸方金額">
        <TextInput
          inputMode="numeric"
          onChangeText={setCreditAmount}
          placeholder="例：8000"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={creditAmount}
        />
      </Field>

      <View style={[styles.balanceBox, balanced ? styles.balanceOk : styles.balanceWarning]}>
        <Text style={[styles.balanceText, balanced ? styles.balanceOkText : styles.balanceWarningText]}>
          {balanced ? "借方・貸方が一致しています" : "借方・貸方の金額が一致していません"}
        </Text>
      </View>

      <Field label="摘要メモ">
        <TextInput
          inputMode="text"
          multiline
          onChangeText={setMemo}
          placeholder="例：消耗品を現金で購入"
          placeholderTextColor="#94A3B8"
          style={[styles.input, styles.memoInput]}
          value={memo}
        />
      </Field>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        onPress={handleSubmit}
        style={({ pressed }) => [styles.button, { backgroundColor: tone }, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>入力を追加</Text>
      </Pressable>
    </View>
  );
}

type FieldProps = {
  children: React.ReactNode;
  label: string;
};

function Field({ children, label }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

type OptionGroupProps = {
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  selected: string;
  tone: string;
};

function OptionGroup({ label, onSelect, options, selected, tone }: OptionGroupProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.optionWrap}>
        {options.map((option) => {
          const active = option === selected;
          return (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => onSelect(option)}
              style={({ pressed }) => [
                styles.option,
                { borderColor: active ? tone : "#E2E8F0" },
                active && { backgroundColor: tone },
                pressed && styles.optionPressed
              ]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
    width: "100%"
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
    minWidth: 0
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  field: {
    marginTop: 14,
    width: "100%"
  },
  fieldLabel: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%"
  },
  memoInput: {
    minHeight: 76,
    textAlignVertical: "top"
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    width: "100%"
  },
  option: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  optionPressed: {
    opacity: 0.82
  },
  optionText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800"
  },
  optionTextActive: {
    color: "#FFFFFF"
  },
  balanceBox: {
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 11
  },
  balanceOk: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0"
  },
  balanceWarning: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74"
  },
  balanceText: {
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19
  },
  balanceOkText: {
    color: "#047857"
  },
  balanceWarningText: {
    color: "#C2410C"
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
    marginTop: 12
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 16,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 13
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  }
});
