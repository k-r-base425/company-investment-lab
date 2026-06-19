import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  accountingTypeLabels,
  accountingTypeTones,
  costBehaviorOptions,
  getCategories,
  getPaymentMethods,
  spendingJudgementOptions
} from "../../lib/accounting/accountingOptions";
import type {
  AccountingEntry,
  AccountingEntryType,
  CostBehavior,
  PaymentMethod,
  SpendingJudgement
} from "../../lib/types/accounting";

type AccountingEntryFormProps = {
  type: Exclude<AccountingEntryType, "journal">;
  onAdd: (entry: AccountingEntry) => void;
};

export function AccountingEntryForm({ type, onAdd }: AccountingEntryFormProps) {
  const [date, setDate] = useState("2026-06-05");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(getCategories(type)[0] ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(getPaymentMethods(type)[0] ?? "その他");
  const [memo, setMemo] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [costBehavior, setCostBehavior] = useState<CostBehavior>("variable");
  const [spendingJudgement, setSpendingJudgement] = useState<SpendingJudgement>("necessary");
  const [error, setError] = useState("");

  useEffect(() => {
    setDate("2026-06-05");
    setAmount("");
    setCategory(getCategories(type)[0] ?? "");
    setPaymentMethod(getPaymentMethods(type)[0] ?? "その他");
    setMemo("");
    setPartnerName("");
    setCostBehavior("variable");
    setSpendingJudgement("necessary");
    setError("");
  }, [type]);

  const tone = accountingTypeTones[type];
  const categories = getCategories(type);
  const paymentMethods = getPaymentMethods(type);
  const needsCostFields = type === "expense" || type === "household";

  const handleSubmit = () => {
    const numericAmount = Number(amount.replace(/,/g, ""));

    if (!date.trim() || !amount.trim() || !category.trim() || !paymentMethod || !memo.trim()) {
      setError("日付、金額、カテゴリ、支払方法、メモを入力してください。");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("金額は1以上の数値で入力してください。");
      return;
    }

    if (type === "revenue" && !partnerName.trim()) {
      setError("売上では取引先名を入力してください。");
      return;
    }

    onAdd({
      id: `${type}-${Date.now()}`,
      type,
      date: date.trim(),
      amount: numericAmount,
      category,
      paymentMethod,
      memo: memo.trim(),
      partnerName: type === "revenue" ? partnerName.trim() : undefined,
      costBehavior: needsCostFields ? costBehavior : undefined,
      spendingJudgement: needsCostFields ? spendingJudgement : undefined
    });

    setDate("2026-06-05");
    setAmount("");
    setCategory(categories[0] ?? "");
    setPaymentMethod(paymentMethods[0] ?? "その他");
    setMemo("");
    setPartnerName("");
    setCostBehavior("variable");
    setSpendingJudgement("necessary");
    setError("");
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{accountingTypeLabels[type]}を入力</Text>
        <View style={[styles.typeBadge, { backgroundColor: tone }]}>
          <Text style={styles.typeBadgeText}>{accountingTypeLabels[type]}</Text>
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

      <Field label="金額">
        <TextInput
          inputMode="numeric"
          onChangeText={setAmount}
          placeholder="例：12000"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={amount}
        />
      </Field>

      <OptionGroup label="カテゴリ" options={categories} selected={category} onSelect={setCategory} tone={tone} />
      <OptionGroup
        label="支払方法"
        options={paymentMethods}
        selected={paymentMethod}
        onSelect={(value) => setPaymentMethod(value as PaymentMethod)}
        tone={tone}
      />

      {type === "revenue" ? (
        <Field label="取引先名">
          <TextInput
            inputMode="text"
            onChangeText={setPartnerName}
            placeholder="例：サンプル株式会社"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={partnerName}
          />
        </Field>
      ) : null}

      {needsCostFields ? (
        <>
          <OptionGroup
            label="固定費 / 変動費"
            options={costBehaviorOptions.map((option) => option.label)}
            selected={costBehaviorOptions.find((option) => option.value === costBehavior)?.label ?? "変動費"}
            onSelect={(label) => {
              const next = costBehaviorOptions.find((option) => option.label === label);
              if (next) setCostBehavior(next.value);
            }}
            tone={tone}
          />
          <OptionGroup
            label="必要支出 / 浪費 / 投資"
            options={spendingJudgementOptions.map((option) => option.label)}
            selected={spendingJudgementOptions.find((option) => option.value === spendingJudgement)?.label ?? "必要支出"}
            onSelect={(label) => {
              const next = spendingJudgementOptions.find((option) => option.label === label);
              if (next) setSpendingJudgement(next.value);
            }}
            tone={tone}
          />
        </>
      ) : null}

      <Field label="メモ">
        <TextInput
          inputMode="text"
          multiline
          onChangeText={setMemo}
          placeholder="内容を入力"
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
