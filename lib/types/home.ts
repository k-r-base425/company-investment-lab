export type KpiTrend = {
  label: string;
  value: string;
  tone: "positive" | "negative" | "neutral" | "warning";
};

export type HomeKpi = {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  tone: "blue" | "green" | "red" | "purple" | "orange" | "teal" | "gray";
  trends?: KpiTrend[];
  emphasis?: boolean;
};
