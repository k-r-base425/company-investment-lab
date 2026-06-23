export function formatInvestmentAmount(value: number) {
  const absValue = Math.abs(Math.round(value));
  const prefix = value < 0 ? "-¥" : "¥";
  return `${prefix}${absValue.toLocaleString("ja-JP")}`;
}

export function formatSignedInvestmentAmount(value: number) {
  if (value > 0) {
    return `+${formatInvestmentAmount(value)}`;
  }

  return formatInvestmentAmount(value);
}

export function formatInvestmentPercent(value: number, signed = false) {
  const percent = `${(value * 100).toFixed(1)}%`;

  if (!signed || value === 0) {
    return percent;
  }

  return value > 0 ? `+${percent}` : percent;
}

export function formatInvestmentMultiple(value?: number) {
  return typeof value === "number" ? `${value.toFixed(1)}倍` : "未設定";
}

export function formatOptionalInvestmentPercent(value?: number) {
  return typeof value === "number" ? formatInvestmentPercent(value) : "未設定";
}
