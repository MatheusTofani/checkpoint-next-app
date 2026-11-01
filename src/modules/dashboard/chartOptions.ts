import { formatCurrency } from "@/src/lib/format";
import type { RankedValue, StockMovement, TimePoint } from "./aggregate";
import type { ChartTheme } from "./chartTheme";
import type { ChartOptionBuilder } from "./components/EChart";

const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCompactCurrency = (value: number) => compactCurrency.format(value);

/** Altura de um gráfico de barras horizontais conforme o número de barras. */
export const barChartHeight = (count: number) => Math.max(160, count * 36 + 32);

function tooltip(theme: ChartTheme) {
  return {
    backgroundColor: theme.tooltipBackground,
    borderColor: theme.tooltipBorder,
    borderWidth: 1,
    textStyle: { color: theme.textPrimary, fontFamily: theme.fontFamily, fontSize: 12 },
    extraCssText: "border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);",
  };
}

function valueAxis(theme: ChartTheme, formatter: (value: number) => string) {
  return {
    type: "value" as const,
    axisLabel: { color: theme.textMuted, formatter },
    splitLine: { lineStyle: { color: theme.grid } },
  };
}

function categoryAxis(theme: ChartTheme) {
  return {
    type: "category" as const,
    axisLine: { lineStyle: { color: theme.axis } },
    axisTick: { show: false },
    axisLabel: { color: theme.textSecondary },
  };
}

function legend(theme: ChartTheme) {
  return {
    top: 0,
    left: 0,
    icon: "roundRect",
    itemWidth: 12,
    itemHeight: 12,
    textStyle: { color: theme.textSecondary },
  };
}

// ---- Vendas x Compras no tempo (mesma unidade, um eixo só) -------------------

export function timelineOption(points: TimePoint[]): ChartOptionBuilder {
  return (theme) => {
    const line = (name: string, color: string, data: number[]) => ({
      name,
      type: "line" as const,
      data,
      color,
      lineStyle: { width: 2 },
      symbol: "circle",
      symbolSize: 8,
      showSymbol: points.length === 1,
      itemStyle: { borderColor: theme.surface, borderWidth: 2 },
      emphasis: { focus: "series" as const },
    });

    return {
      legend: legend(theme),
      grid: { top: 36, right: 8, bottom: 0, left: 0, containLabel: true },
      tooltip: {
        ...tooltip(theme),
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: theme.axis } },
        valueFormatter: (value: unknown) => formatCurrency(Number(value)),
      },
      xAxis: { ...categoryAxis(theme), boundaryGap: false, data: points.map((p) => p.label) },
      yAxis: valueAxis(theme, formatCompactCurrency),
      series: [
        line("Vendas", theme.sales, points.map((p) => p.sales)),
        line("Compras", theme.purchases, points.map((p) => p.purchases)),
      ],
    };
  };
}

// ---- Ranking em barras horizontais (uma cor só) -----------------------------

export function rankedBarOption(
  items: RankedValue[],
  seriesName: string,
  format: (value: number) => string = formatCurrency
): ChartOptionBuilder {
  return (theme) => ({
    grid: { top: 0, right: 72, bottom: 0, left: 0, containLabel: true },
    tooltip: {
      ...tooltip(theme),
      trigger: "item",
      valueFormatter: (value: unknown) => format(Number(value)),
    },
    xAxis: { ...valueAxis(theme, formatCompactCurrency), show: false },
    yAxis: {
      ...categoryAxis(theme),
      inverse: true,
      data: items.map((item) => item.name),
      axisLabel: { color: theme.textSecondary, width: 120, overflow: "truncate" },
    },
    series: [
      {
        name: seriesName,
        type: "bar",
        data: items.map((item) => item.value),
        color: theme.sales,
        barMaxWidth: 16,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        // Valor no fim da barra, em tinta de texto (não na cor da série)
        label: {
          show: true,
          position: "right",
          color: theme.textSecondary,
          formatter: ({ value }: { value: unknown }) => formatCompactCurrency(Number(value)),
        },
      },
    ],
  });
}

// ---- Movimentação de estoque: comprado x vendido -----------------------------

export function stockOption(items: StockMovement[]): ChartOptionBuilder {
  return (theme) => {
    const bar = (name: string, color: string, data: number[]) => ({
      name,
      type: "bar" as const,
      data,
      color,
      barMaxWidth: 12,
      barGap: "20%",
      itemStyle: { borderRadius: [0, 4, 4, 0] },
    });

    return {
      legend: legend(theme),
      grid: { top: 36, right: 16, bottom: 0, left: 0, containLabel: true },
      tooltip: {
        ...tooltip(theme),
        trigger: "axis",
        axisPointer: { type: "shadow", shadowStyle: { color: theme.grid, opacity: 0.4 } },
        valueFormatter: (value: unknown) => `${Number(value).toLocaleString("pt-BR")} un.`,
      },
      xAxis: valueAxis(theme, (value) => value.toLocaleString("pt-BR")),
      yAxis: {
        ...categoryAxis(theme),
        inverse: true,
        data: items.map((item) => item.name),
        axisLabel: { color: theme.textSecondary, width: 120, overflow: "truncate" },
      },
      series: [
        bar("Vendido", theme.sales, items.map((item) => item.sold)),
        bar("Comprado", theme.purchases, items.map((item) => item.purchased)),
      ],
    };
  };
}
