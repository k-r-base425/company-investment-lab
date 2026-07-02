import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { LearningMemo } from "../../lib/types/learningMemo";

type LearningMemoEditorProps = {
  initialMemo?: LearningMemo | null;
  onCancel: () => void;
  onSave: (params: { body: string; title: string }) => Promise<boolean> | boolean | void;
};

export function LearningMemoEditor({ initialMemo, onCancel, onSave }: LearningMemoEditorProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initialMemo?.title ?? "");
    setBody(initialMemo?.body ?? "");
    setError("");
  }, [initialMemo]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("タイトルを入力してください。");
      return;
    }

    if (!body.trim()) {
      setError("本文を入力してください。");
      return;
    }

    const didSave = await onSave({ body: body.trim(), title: title.trim() });

    if (didSave !== false) {
      setTitle("");
      setBody("");
      setError("");
    }
  };

  return (
    <View style={styles.editor}>
      <Text style={styles.editorTitle}>{initialMemo ? "学習メモを編集" : "学習メモを追加"}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>タイトル</Text>
        <TextInput
          onChangeText={setTitle}
          placeholder="例：PERを見るときの確認ポイント"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={title}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>本文</Text>
        <TextInput
          multiline
          onChangeText={setBody}
          placeholder="学んだこと、次に確認したい数字、AI分析から残したい気づき"
          placeholderTextColor="#94A3B8"
          style={[styles.input, styles.bodyInput]}
          textAlignVertical="top"
          value={body}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonRow}>
        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.saveButtonText}>{initialMemo ? "メモを更新" : "保存"}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCancel}
          style={({ pressed }) => [styles.cancelButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  editor: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    padding: 12
  },
  editorTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  field: {
    marginTop: 10
  },
  label: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    paddingHorizontal: 10,
    paddingVertical: 9,
    width: "100%"
  },
  bodyInput: {
    minHeight: 96
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 10
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12
  },
  cancelButtonText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900"
  },
  buttonPressed: {
    opacity: 0.78
  }
});
