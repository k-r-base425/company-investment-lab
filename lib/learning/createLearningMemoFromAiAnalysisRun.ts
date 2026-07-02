import type { AiAnalysisRun } from "../types/aiAnalysisRun";
import type { LearningMemo, LearningMemoCategory } from "../types/learningMemo";

export function createLearningMemoFromAiAnalysisRun(run: AiAnalysisRun): LearningMemo {
  const now = new Date().toISOString();
  const topic = inferTopic(run);

  return {
    id: createId(),
    topicId: topic.topicId,
    topicTitle: topic.topicTitle,
    category: topic.category,
    title: `AI分析メモ：${run.title}`,
    body: buildMemoBody(run),
    source: "ai_analysis",
    sourceAiAnalysisRunId: run.id,
    sourceAiAnalysisRunTitle: run.title,
    relatedScreen: "AI分析履歴",
    createdAt: now,
    updatedAt: now
  };
}

function inferTopic(run: AiAnalysisRun): { category: LearningMemoCategory; topicId: string; topicTitle: string } {
  if (run.theme === "business_profitability") {
    return { category: "accounting", topicId: "expense-profit-margin", topicTitle: "経費率と利益率" };
  }

  if (run.theme === "household_review") {
    return { category: "accounting", topicId: "estimated-tax-investable", topicTitle: "税金目安と投資可能額" };
  }

  if (run.theme === "investment_review") {
    return { category: "investment", topicId: "per-pbr-roe", topicTitle: "PER / PBR / ROE" };
  }

  if (run.theme === "investment_holding_review") {
    return { category: "ai_analysis", topicId: "holding-ai-analysis", topicTitle: "銘柄別AI分析" };
  }

  if (run.theme === "learning_review") {
    return { category: "ai_analysis", topicId: "ai-analysis-review", topicTitle: "AI分析結果の見返し" };
  }

  if (run.theme === "monthly_review") {
    return { category: "accounting", topicId: "profit-vs-cashflow", topicTitle: "利益とキャッシュフローの違い" };
  }

  return { category: "ai_analysis", topicId: "ai-analysis-review", topicTitle: "AI分析結果の見返し" };
}

function buildMemoBody(run: AiAnalysisRun) {
  const parts = [
    run.responseText ? `AI回答:\n${run.responseText}` : "",
    run.memo ? `自分用メモ:\n${run.memo}` : "",
    run.nextAction ? `次の行動:\n${run.nextAction}` : ""
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join("\n\n");
  }

  return `プロンプト抜粋:\n${run.promptText.slice(0, 500)}`;
}

function createId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `learning-memo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
