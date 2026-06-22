import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { accountingTypeTones, journalAccountOptions } from "../../lib/accounting/accountingOptions";
import { defaultSelectedMonth } from "../../lib/month/monthUtils";
import { parseAmount, validateJournalEntryInput } from "../../lib/accounting/validation";
import type { AccountingEntry } from "../../lib/types/accounting";

type JournalEntryFormProps = {
  defaultDate?: string;
  editingEntry?: AccountingEntry | null;
  onCancelEdit?: () => void;
  onSubmit: (entry: AccountingEntry) => Promise<boolean> | boolean | void;
  submitLabel?: string;
};

export function JournalEntryForm({
  defaultDate = `${defaultSelectedMonth}-05`,
  editingEntry = null,
  onCancelEdit,
  onSubmit,
  submitLabel = "入力を追加"
}: JournalEntryFormProps) {
  const [date, setDate] = useState(defaultDate);
  const [debitAccount, setDebitAccount] = useState("消耗品費");
  const [debitAmount, setDebitAmount] = useState("");
  const [creditAccount, setCreditAccount] = useState("現金");
  const [creditAmount, setCreditAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");

  const tone = accountingTypeTones.journal;
  const numericDebit = parseAmount(debitAmount);
  const numericCredit = parseAmount(creditAmount);
  const amountsAreValid = Number.isFinite(numericDebit) && Number.isFinite(numericCredit) && numericDebit > 0 && numericCredit > 0;
  const balanced = amountsAreValid && numericDebit === numericCredit;

  useEffect(() => {
    if (editingEntry?.type === "journal") {
      setDate(editingEntry.date);
      setDebitAccount(editingEntry.debitAccount ?? "消耗品費");
      setDebitAmount(String(editingEntry.debitAmount ?? editingEntry.amount));
      setCreditAccount(editingEntry.creditAccount ?? "現金");
      setCreditAmount(String(editingEntry.creditAmount ?? editingEntry.amount));
      setMemo(editingEntry.memo);
      setError("");
      return;
    }

    resetForm();
  }, [editingEntry, defaultDate]);

  const resetForm = () => {
    setDate(defaultDate);
    setDebitAccount("消耗品費");
    setDebitAmount("");
    setCreditAccount("現金");
    setCreditAmount("");
    setMemo("");
    setError("");
  };

  const handleSubmit = async () => {
    const errors = validateJournalEntryInput({
      date,
      debitAccount,
      debitAmount,
      creditAccount,
      creditAmount,
      memo
    });

    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    const didSubmit = await onSubmit({
      id: editingEntry?.id ?? `journal-${Date.now()}`,
      type: "journal",
      date: date.trim(),
      amount: numericDebit,
      memo: memo.trim(),
      debitAccount,
      debitAmount: numericDebit,
      creditAccount,
      creditAmount: numericCredit,
      createdAt: editingEntry?.createdAt,
      updatedAt: editingEntry?.updatedAt
    });

    if (didSubmit !== false) {
      resetForm();
    }
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
        <Text style={styles.buttonText}>{submitLabel}</Text>
      </Pressable>

      {editingEntry ? (
        <Pressable
          accessibilityRole="button"
          onPress={onCancelEdit}
          style={({ pressed }) => [styles.cancelButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.cancelButtonText}>編集をキャンセル</Text>
        </Pressable>
      ) : null}
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
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 10,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 11
  },
  cancelButtonText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "900"
  }
});
