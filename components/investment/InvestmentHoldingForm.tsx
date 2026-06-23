import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { investmentAssetTypeLabels } from "../../lib/investment/calculateInvestment";
import type { InvestmentAssetType, InvestmentHolding, InvestmentPositionType } from "../../lib/types/investment";

type InvestmentHoldingFormProps = {
  onAdd: (holding: InvestmentHolding) => void;
};

const assetTypes: InvestmentAssetType[] = ["japanese_stock", "us_stock", "mutual_fund", "etf", "cash"];
const positionTypes: { label: string; value: InvestmentPositionType }[] = [
  { label: "実保有", value: "actual" },
  { label: "仮想保有", value: "virtual" }
];

const initialForm = {
  name: "",
  ticker: "",
  assetType: "japanese_stock" as InvestmentAssetType,
  positionType: "actual" as InvestmentPositionType,
  quantity: "",
  averageCost: "",
  currentPrice: "",
  dividendYield: "",
  per: "",
  pbr: "",
  roe: "",
  memo: ""
};

export function InvestmentHoldingForm({ onAdd }: InvestmentHoldingFormProps) {
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = () => {
    setErrorMessage("");
    setSuccessMessage("");

    const name = form.name.trim();
    const quantity = Number(form.quantity);
    const averageCost = Number(form.averageCost);
    const currentPrice = Number(form.currentPrice);

    if (!name) {
      setErrorMessage("銘柄名を入力してください。");
      return;
    }

    if (!form.assetType) {
      setErrorMessage("資産種別を選択してください。");
      return;
    }

    if (!form.quantity.trim() || !form.averageCost.trim() || !form.currentPrice.trim()) {
      setErrorMessage("数量、平均取得単価、現在価格を入力してください。");
      return;
    }

    if (!Number.isFinite(quantity) || !Number.isFinite(averageCost) || !Number.isFinite(currentPrice)) {
      setErrorMessage("数量、平均取得単価、現在価格は数値で入力してください。");
      return;
    }

    if (quantity < 0 || averageCost < 0 || currentPrice < 0) {
      setErrorMessage("数量と価格は0以上で入力してください。");
      return;
    }

    const optionalNumbers = {
      dividendYield: parseOptionalNumber(form.dividendYield),
      per: parseOptionalNumber(form.per),
      pbr: parseOptionalNumber(form.pbr),
      roe: parseOptionalNumber(form.roe)
    };

    if (Object.values(optionalNumbers).some((value) => value === "invalid")) {
      setErrorMessage("PER / PBR / ROE / 配当利回りは数値または空欄で入力してください。");
      return;
    }

    const now = new Date().toISOString();
    onAdd({
      id: `investment-${Date.now()}`,
      name,
      ticker: form.ticker.trim() || undefined,
      assetType: form.assetType,
      positionType: form.positionType,
      quantity,
      averageCost,
      currentPrice,
      dividendYield: optionalNumbers.dividendYield === "invalid" ? undefined : optionalNumbers.dividendYield,
      per: optionalNumbers.per === "invalid" ? undefined : optionalNumbers.per,
      pbr: optionalNumbers.pbr === "invalid" ? undefined : optionalNumbers.pbr,
      roe: optionalNumbers.roe === "invalid" ? undefined : optionalNumbers.roe,
      memo: form.memo.trim() || undefined,
      createdAt: now,
      updatedAt: now
    });
    setForm(initialForm);
    setSuccessMessage("銘柄を追加しました");
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>銘柄追加フォーム</Text>
        <Text style={styles.subtitle}>画面内のサンプル状態に追加します。</Text>
      </View>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}

      <Field label="銘柄名" value={form.name} onChangeText={(value) => updateField("name", value)} placeholder="例：ソニーグループ" />
      <Field label="ティッカー / コード" value={form.ticker} onChangeText={(value) => updateField("ticker", value)} placeholder="例：6758" />

      <Text style={styles.fieldLabel}>資産種別</Text>
      <View style={styles.optionRow}>
        {assetTypes.map((assetType) => (
          <OptionButton
            key={assetType}
            active={form.assetType === assetType}
            label={investmentAssetTypeLabels[assetType]}
            onPress={() => updateField("assetType", assetType)}
          />
        ))}
      </View>

      <Text style={styles.fieldLabel}>保有区分</Text>
      <View style={styles.optionRow}>
        {positionTypes.map((positionType) => (
          <OptionButton
            key={positionType.value}
            active={form.positionType === positionType.value}
            label={positionType.label}
            onPress={() => updateField("positionType", positionType.value)}
          />
        ))}
      </View>

      <View style={styles.twoColumn}>
        <Field label="保有数量" value={form.quantity} onChangeText={(value) => updateField("quantity", value)} keyboardType="numeric" />
        <Field label="平均取得単価" value={form.averageCost} onChangeText={(value) => updateField("averageCost", value)} keyboardType="numeric" />
      </View>

      <Field label="現在価格" value={form.currentPrice} onChangeText={(value) => updateField("currentPrice", value)} keyboardType="numeric" />

      <View style={styles.twoColumn}>
        <Field label="配当利回り" value={form.dividendYield} onChangeText={(value) => updateField("dividendYield", value)} keyboardType="numeric" placeholder="0.028" />
        <Field label="PER" value={form.per} onChangeText={(value) => updateField("per", value)} keyboardType="numeric" />
      </View>

      <View style={styles.twoColumn}>
        <Field label="PBR" value={form.pbr} onChangeText={(value) => updateField("pbr", value)} keyboardType="numeric" />
        <Field label="ROE" value={form.roe} onChangeText={(value) => updateField("roe", value)} keyboardType="numeric" placeholder="0.11" />
      </View>

      <Field
        label="投資メモ"
        value={form.memo}
        onChangeText={(value) => updateField("memo", value)}
        multiline
        placeholder="サンプル用の投資メモ"
      />

      <Pressable accessibilityRole="button" onPress={handleSubmit} style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}>
        <Text style={styles.submitText}>銘柄を追加</Text>
      </Pressable>
    </View>
  );
}

function parseOptionalNumber(value: string): number | undefined | "invalid" {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "invalid";
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
  placeholder?: string;
};

function Field({ label, value, onChangeText, keyboardType = "default", multiline, placeholder }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
      />
    </View>
  );
}

function OptionButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.optionButton, active && styles.optionButtonActive, pressed && styles.optionButtonPressed]}
    >
      <Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 14,
    width: "100%"
  },
  header: {
    marginBottom: 12
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900"
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  field: {
    flex: 1,
    marginTop: 10,
    minWidth: 0
  },
  fieldLabel: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
    marginBottom: 6,
    marginTop: 8
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "800",
    minHeight: 44,
    paddingHorizontal: 11,
    paddingVertical: 9,
    width: "100%"
  },
  multilineInput: {
    minHeight: 84,
    textAlignVertical: "top"
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minWidth: 0
  },
  optionButton: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  optionButtonActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#818CF8"
  },
  optionButtonPressed: {
    opacity: 0.78
  },
  optionText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17
  },
  optionTextActive: {
    color: "#3730A3"
  },
  twoColumn: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    minWidth: 0
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
    marginBottom: 8,
    padding: 10
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
    marginBottom: 8,
    padding: 10
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 8,
    marginTop: 14,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  submitButtonPressed: {
    opacity: 0.82
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20
  }
});
