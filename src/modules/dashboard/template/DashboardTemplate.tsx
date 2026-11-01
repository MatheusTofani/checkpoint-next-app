"use client";

import { useMemo, useState } from "react";
import { getApiErrorMessage } from "@/src/api/api";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { PageHeader } from "@/src/modules/common/components/PageHeader";
import { aggregateDashboard } from "../aggregate";
import {
  barChartHeight,
  rankedBarOption,
  stockOption,
  timelineOption,
} from "../chartOptions";
import { ChartCard } from "../components/ChartCard";
import { DashboardFilters } from "../components/DashboardFilters";
import { EChart } from "../components/EChart";
import { StatTiles } from "../components/StatTiles";
import { useDashboardData, type DashboardFiltersValue } from "../useDashboardData";

const emptyFilters: DashboardFiltersValue = {
  from: "",
  to: "",
  leadId: "",
  productId: "",
  category: "",
};

export default function DashboardTemplate() {
  const [filters, setFilters] = useState(emptyFilters);
  const [preset, setPreset] = useState("all");
  const { sales, purchases, products, leads } = useDashboardData(filters);

  const loading = sales.isPending || purchases.isPending || products.isPending;
  const error = sales.error ?? purchases.error ?? products.error;

  const summary = useMemo(
    () =>
      sales.data && purchases.data && products.data
        ? aggregateDashboard({
            sales: sales.data,
            purchases: purchases.data,
            products: products.data,
            productId: filters.productId,
            category: filters.category,
            from: filters.from,
            to: filters.to,
          })
        : null,
    [sales.data, purchases.data, products.data, filters]
  );

  // Builders memoizados: o EChart só reaplica a opção quando os dados mudam
  const charts = useMemo(
    () =>
      summary && {
        timeline: timelineOption(summary.timeline),
        products: rankedBarOption(summary.topProducts, "Receita"),
        categories: rankedBarOption(summary.categories, "Receita"),
        leads: rankedBarOption(summary.topLeads, "Receita"),
        payments: rankedBarOption(summary.paymentMethods, "Receita"),
        stock: stockOption(summary.stock),
      },
    [summary]
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader title="Início" description="Visão geral de vendas, compras e produtos" />

      <DashboardFilters
        value={filters}
        onChange={setFilters}
        preset={preset}
        onPresetChange={setPreset}
        leads={leads.data?.items ?? []}
        products={products.data ?? []}
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>
            {getApiErrorMessage(error, "Não foi possível carregar os dados do painel")}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <StatTiles summary={summary} />

          <ChartCard
            title="Vendas e compras"
            description="Valor vendido (com descontos) e valor gasto em compras no período"
            loading={loading}
            empty={!summary?.timeline.some((p) => p.sales || p.purchases)}
          >
            {charts && (
              <EChart
                option={charts.timeline}
                height={300}
                label="Gráfico de linhas com vendas e compras ao longo do tempo"
              />
            )}
          </ChartCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Produtos mais vendidos"
              description="Receita por produto"
              loading={loading}
              empty={!summary?.topProducts.length}
            >
              {charts && summary && (
                <EChart
                  option={charts.products}
                  height={barChartHeight(summary.topProducts.length)}
                  label="Ranking de produtos por receita"
                />
              )}
            </ChartCard>

            <ChartCard
              title="Vendas por categoria"
              description="Receita por categoria de produto"
              loading={loading}
              empty={!summary?.categories.length}
            >
              {charts && summary && (
                <EChart
                  option={charts.categories}
                  height={barChartHeight(summary.categories.length)}
                  label="Receita por categoria"
                />
              )}
            </ChartCard>

            <ChartCard
              title="Melhores clientes"
              description="Receita por cliente (vendas sem cliente ficam de fora)"
              loading={loading}
              empty={!summary?.topLeads.length}
            >
              {charts && summary && (
                <EChart
                  option={charts.leads}
                  height={barChartHeight(summary.topLeads.length)}
                  label="Ranking de clientes por receita"
                />
              )}
            </ChartCard>

            <ChartCard
              title="Formas de pagamento"
              description="Receita por forma de pagamento"
              loading={loading}
              empty={!summary?.paymentMethods.length}
            >
              {charts && summary && (
                <EChart
                  option={charts.payments}
                  height={barChartHeight(summary.paymentMethods.length)}
                  label="Receita por forma de pagamento"
                />
              )}
            </ChartCard>
          </div>

          <ChartCard
            title="Movimentação de produtos"
            description="Unidades compradas e vendidas no período, por produto"
            loading={loading}
            empty={!summary?.stock.length}
          >
            {charts && summary && (
              <EChart
                option={charts.stock}
                height={barChartHeight(summary.stock.length * 2) + 36}
                label="Unidades compradas e vendidas por produto"
              />
            )}
          </ChartCard>
        </>
      )}
    </div>
  );
}
