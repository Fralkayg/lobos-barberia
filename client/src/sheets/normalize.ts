export function toBool(value: string): boolean {
  const v = value.trim().toUpperCase();
  return v === "TRUE" || v === "1" || v === "SI" || v === "SÍ";
}

export function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
