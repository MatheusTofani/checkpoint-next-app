"use client";

import { useEffect, useRef, useState } from "react";
import { BarChart, LineChart } from "echarts/charts";
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getChartTheme, type ChartTheme } from "../chartTheme";

// Importa só o que os gráficos usam, para manter o bundle pequeno
echarts.use([
  BarChart,
  LineChart,
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

export type ChartOptionBuilder = (theme: ChartTheme) => echarts.EChartsCoreOption;

function readTheme() {
  return getChartTheme(
    document.documentElement.classList.contains("dark"),
    getComputedStyle(document.body).fontFamily
  );
}

/** Acompanha a classe `.dark` do <html> (custom-variant do Tailwind). */
function useChartTheme() {
  const [theme, setTheme] = useState<ChartTheme | null>(null);

  useEffect(() => {
    const update = () => setTheme(readTheme());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    // Lido após montar: no servidor não há DOM para descobrir o tema e a fonte
    queueMicrotask(update);
    return () => observer.disconnect();
  }, []);

  return theme;
}

interface EChartProps {
  option: ChartOptionBuilder;
  height: number;
  /** Descrição para leitores de tela. */
  label: string;
}

export function EChart({ option, height, label }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const theme = useChartTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = echarts.init(container, null, { renderer: "canvas" });
    chartRef.current = chart;
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!theme || !chartRef.current) return;
    chartRef.current.setOption(
      {
        aria: { enabled: true, label: { description: label } },
        textStyle: { fontFamily: theme.fontFamily, color: theme.textSecondary },
        animationDuration: 300,
        ...option(theme),
      },
      { notMerge: true }
    );
  }, [option, theme, label]);

  return <div ref={containerRef} role="img" aria-label={label} style={{ height }} className="w-full" />;
}
