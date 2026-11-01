// Paletas validadas (CVD e contraste) contra a superfície do card (--card) de cada tema.
// Vendas = verde da marca e Compras = azul em todos os gráficos: a cor acompanha
// a entidade, nunca a posição. O rosa (--accent) fica de fora: é também a cor de
// erro (--destructive) e não se separa do verde para daltônicos.
export interface ChartTheme {
  sales: string;
  purchases: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  grid: string;
  axis: string;
  surface: string;
  tooltipBackground: string;
  tooltipBorder: string;
  fontFamily: string;
}

// Card #f4f7f4
const light: Omit<ChartTheme, "fontFamily"> = {
  sales: "#13865f",
  purchases: "#2a78d6",
  textPrimary: "#071019",
  textSecondary: "#52615b",
  textMuted: "#6b7a73",
  grid: "#d5ddd8",
  axis: "#b4c0b9",
  surface: "#f4f7f4",
  tooltipBackground: "#f4f7f4",
  tooltipBorder: "rgba(7,16,25,0.12)",
};

// Card #0d1c2f
const dark: Omit<ChartTheme, "fontFamily"> = {
  sales: "#1ba673",
  purchases: "#3987e5",
  textPrimary: "#e4eae4",
  textSecondary: "#b5c2bc",
  textMuted: "#8a9a93",
  grid: "#1c3048",
  axis: "#2a405a",
  surface: "#0d1c2f",
  tooltipBackground: "#071019",
  tooltipBorder: "rgba(228,234,228,0.14)",
};

export function getChartTheme(isDark: boolean, fontFamily: string): ChartTheme {
  return { ...(isDark ? dark : light), fontFamily };
}
