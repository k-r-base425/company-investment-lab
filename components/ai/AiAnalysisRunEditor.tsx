import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { AiAnalysisRun } from "../../lib/types/aiAnalysisRun";

type AiAnalysisRunEditorProps = {
  onCancel: () => void;
  onSave: (params: { responseText: string; memo?: string; nextAction?: string }) => Promise<boolean> | boolean | void;
  run: AiAnalysisRun | null;
};

export function AiAnalysisRunEditor({ onCancel, onSave, run }: AiAnalysisRunEditorProps) {
  const [responseText, setResponseText] = useState("");
  const [memo, setMemo] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setResponseText(run?.responseText ?? "");
    setMemo(run?.memo ?? "");
    setNextAction(run?.nextAction ?? "");
    setError("");
  }, [run]);

  if (!run) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>履歴を選択してください</Text>
        <Text style={styles.emptyText}>「回答を保存」または「編集」から、AI回答・メモ・次の行動を保存できます。</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!responseText.trim()) {
      setError("AI回答を入力してください。");
      return;
    }

    const didSave = await onSave({
      responseText: responseText.trim(),
      memo: memo.trim() || undefined,
      nextAction: nextAction.trim() || undefined
    });

    if (didSave !== false) {
      setError("");
    }
  };

  return (
    <View style={styles.editor}>
      <View style={styles.editorHeader}>
        <Text style={styles.editorTitle}>分析結果を保存</Text>
        <Text style={styles.editorSubtitle}>{run.title}</Text>
      </View>

      <Field label="AI回答">
        <TextInput
          multiline
          onChangeText={setResponseText}
          placeholder="ChatGPTなどから返ってきた分析結果を貼り付け"
          placeholderTextColor="#94A3B8"
          style={[styles.input, styles.largeInput]}
          textAlignVertical="top"
          value={responseText}
        />
      </Field>

      <Field label="自分用メモ">
        <TextInput
          multiline
          onChangeText={setMemo}
          placeholder="気づきや補足メモ"
          placeholderTextColor="#94A3B8"
          style={[styles.input, styles.mediumInput]}
          textAlignVertical="top"
          value={memo}
        />
      </Field>

      <Field label="次の行動">
        <TextInput
          multiline
          onChangeText={setNextAction}
          placeholder="次にやること"
          placeholderTextColor="#94A3B8"
          style={[styles.input, styles.mediumInput]}
          textAlignVertical="top"
          value={nextAction}
        />
      </Field>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonRow}>
        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.saveButtonText}>分析結果を保存</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCancel}
          style={({ pressed }) => [styles.cancelButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.cancelButtonText}>閉じる</Text>
        </Pressable>
      </View>
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
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyBox: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 14
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "900"
  },
  emptyText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 6
  },
  editor: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 14
  },
  editorHeader: {
    gap: 4
  },
  editorTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900"
  },
  editorSubtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18
  },
  field: {
    marginTop: 14
  },
  label: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%"
  },
  largeInput: {
    minHeight: 160
  },
  mediumInput: {
    minHeight: 92
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
    marginTop: 12
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 11
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 11
  },
  cancelButtonText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "900"
  },
  buttonPressed: {
    opacity: 0.78
  }
});
