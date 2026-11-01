const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

/** Aceita "12,50" ou "12.50". Retorna NaN se inválido. */
export function parseDecimal(value: FormDataEntryValue | string | null) {
  const text = String(value ?? "").trim().replace(",", ".");
  return text ? Number(text) : NaN;
}

/** Data de hoje no formato do <input type="date"> (yyyy-mm-dd), no fuso local. */
export function todayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

/**
 * Converte o valor de um <input type="date"> para ISO no fuso local.
 * `"start"`/`"end"` viram início/fim do dia (filtros); `"noon"` evita que a data
 * "volte" um dia ao ser exibida em outro fuso.
 */
export function dateInputToIso(value: string, at: "start" | "end" | "noon" = "noon") {
  const time = { start: "00:00:00", end: "23:59:59.999", noon: "12:00:00" }[at];
  return new Date(`${value}T${time}`).toISOString();
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
