export type AccountingInsightSeverity = "good" | "notice" | "warning" | "danger";

export type AccountingInsightCategory =
  | "profitability"
  | "expense"
  | "household"
  | "fixed_cost"
  | "waste"
  | "investment"
  | "tax"
  | "cashflow"
  | "data_quality";

export type AccountingInsight = {
  id: string;
  category: AccountingInsightCategory;
  severity: AccountingInsightSeverity;
  title: string;
  message: string;
  metricLabel?: string;
  metricValue?: string;
  recommendation: string;
  actionItems: string[];
  relatedData?: {
    label: string;
    value: string;
  }[];
  priority: number;
};
