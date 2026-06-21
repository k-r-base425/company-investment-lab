# 改善アクション管理

## 目的

改善コメントの `actionItems` を、実際に管理できる「改善アクション」として保存します。

コメントは見直しポイントを示すもの、改善アクションは今月やることを未完了 / 完了で追跡するものです。

## 対象月

- 内部値：`2026-06`
- 画面表示：2026年6月

## ImprovementAction型

主な項目は以下です。

- `id`
- `period`
- `title`
- `description`
- `category`
- `source`
- `status`
- `priority`
- `sourceInsightId`
- `sourceInsightTitle`
- `sourceActionIndex`
- `actionKey`
- `completedAt`
- `createdAt`
- `updatedAt`

## actionItemsから生成する流れ

1. 保存済み会計入力から `buildAccountingInsights` で改善コメントを作る
2. `buildImprovementActionsFromInsights` で `actionItems` をアクション化する
3. `upsertImprovementActionsByActionKey` で保存する
4. 同じ `period / insight / actionItem` は重複保存しない

## actionKey

`actionKey` は改善コメントから同じアクションを何度も作らないためのキーです。

形式：

```txt
period:insight.id:actionIndex:actionText
```

## 保存方式

Web / GitHub Pagesでは `localStorage` を使います。

キー：

```txt
company-investment-lab:improvement_actions:v1
```

ネイティブ実行では既存SQLite DBを使います。

DB名：

```txt
company_investment_lab.db
```

テーブル名：

```txt
improvement_actions
```

## SQLiteテーブル

```sql
CREATE TABLE IF NOT EXISTS improvement_actions (
  id TEXT PRIMARY KEY NOT NULL,
  period TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  source_insight_id TEXT,
  source_insight_title TEXT,
  source_action_index INTEGER,
  action_key TEXT,
  due_date TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

インデックス：

- `period`
- `status`
- `action_key`

## ホームカードとの連動

ホーム画面では「今月の改善アクション」カードを表示します。

- 未完了件数
- 完了件数
- 達成率
- 未完了アクション上位3件

完了操作や削除は会計タブに集約します。

## AI分析JSONとの整合

ホームAI分析コピーには `improvementActions` を含めます。

同じ `buildImprovementActionsSummary` を使うため、ホームカードとAI分析JSONで件数や達成率が一致します。

## JSONエクスポートとの整合

`buildAccountingJson(entries, month, actions)` でも `improvementActions` を含めます。

CSVエクスポートへの追加は今回の対象外です。

## 今回できること

- 改善コメントからアクションを作成する
- actionKeyで重複保存を防ぐ
- 未完了 / 完了を切り替える
- 完了時に `completedAt` を保存する
- 未完了に戻すと `completedAt` を解除する
- アクションを削除する
- ホームで今月の改善アクション概要を見る
- AI分析JSON / JSONエクスポート用データに改善アクションを含める

## 今回やらないこと

- 手動アクション追加
- 期限リマインダー
- 通知
- 月またぎ管理
- AI API連携
- 改善効果の自動測定

## 将来拡張

- 期限管理
- 通知
- 月またぎの継続アクション
- AI分析履歴との紐づけ
- 改善効果の測定
- カテゴリ別の改善進捗

## 注意

GitHub Pagesは公開URLです。実データ、個人情報、APIキー、CSV、SQLite DBはコミットせず、公開画面にも入力しないでください。
