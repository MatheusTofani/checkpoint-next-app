import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { formatCurrency } from "@/src/lib/format";
import type { DashboardSummary } from "../aggregate";

interface StatTilesProps {
  summary: DashboardSummary | null;
}

export function StatTiles({ summary }: StatTilesProps) {
  const tiles = summary && [
    { label: "Receita de vendas", value: formatCurrency(summary.revenue) },
    { label: "Vendas", value: summary.salesCount.toLocaleString("pt-BR") },
    { label: "Ticket médio", value: formatCurrency(summary.averageTicket) },
    { label: "Unidades vendidas", value: summary.unitsSold.toLocaleString("pt-BR") },
    { label: "Gasto em compras", value: formatCurrency(summary.purchasesTotal) },
    {
      label: "Resultado",
      value: formatCurrency(summary.result),
      hint: "Receita menos compras no período",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {tiles
        ? tiles.map((tile) => (
            <Card key={tile.label} size="sm">
              <CardContent className="grid gap-1">
                <span className="text-xs text-muted-foreground" title={tile.hint}>
                  {tile.label}
                </span>
                <span className="truncate text-xl font-semibold">{tile.value}</span>
              </CardContent>
            </Card>
          ))
        : Array.from({ length: 6 }, (_, index) => (
            <Card key={index} size="sm">
              <CardContent className="grid gap-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-6 w-4/5" />
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
