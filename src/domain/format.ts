export function formatWan(value: number): string {
  if (!Number.isFinite(value)) {
    return '0 万'
  }

  const wanValue = value / 10_000
  const rounded = Math.round((wanValue + Number.EPSILON) * 100) / 100
  return `${rounded.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 万`
}
