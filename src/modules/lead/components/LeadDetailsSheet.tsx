"use client";

import { useState } from "react";
import { ReceiptTextIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import type { LeadResponse } from "@/src/api/routes/lead/leadModels";
import { useLeadApi } from "@/src/api/routes/lead/useLeadApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Skeleton } from "@/src/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/src/lib/format";

interface LeadDetailsSheetProps {
  lead: LeadResponse;
}

export function LeadDetailsSheet({ lead }: LeadDetailsSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <ReceiptTextIcon data-icon="inline-start" />
        Ver compras
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{lead.name}</SheetTitle>
          <SheetDescription>Resumo das compras deste lead</SheetDescription>
        </SheetHeader>
        {/* Só busca os detalhes quando o painel abre */}
        {open && <LeadDetails id={lead.id} />}
      </SheetContent>
    </Sheet>
  );
}

function LeadDetails({ id }: { id: string }) {
  const { GetLeadById } = useLeadApi();
  const { data, isPending, isError, error } = GetLeadById(id);

  if (isError) {
    return (
      <div className="px-4">
        <Alert variant="destructive">
          <AlertDescription>
            {getApiErrorMessage(error, "Não foi possível carregar o lead")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16" />
        ))}
      </div>
    );
  }

  if (data.salesCount === 0) {
    return <p className="px-4 text-muted-foreground">Nenhuma compra registrada.</p>;
  }

  return (
    <div className="grid gap-6 px-4 pb-4">
      <dl className="grid grid-cols-2 gap-3">
        <Stat label="Total gasto" value={formatCurrency(data.totalSpent)} />
        <Stat label="Compras" value={String(data.salesCount)} />
        <Stat label="Ticket médio" value={formatCurrency(data.averageTicket)} />
        <Stat label="Descontos" value={formatCurrency(data.totalDiscount)} />
      </dl>

      {data.lastSaleAt && (
        <p className="text-muted-foreground">
          Última compra em {formatDate(data.lastSaleAt)}
          {data.firstSaleAt && ` · cliente desde ${formatDate(data.firstSaleAt)}`}
        </p>
      )}

      <section className="grid gap-2">
        <h3 className="font-medium">Produtos comprados</h3>
        <ul className="divide-y rounded-lg border">
          {data.products.map((product) => (
            <li key={product.productId} className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.quantity} un. · última em {formatDate(product.lastSoldAt)}
                </p>
              </div>
              <span className="tabular-nums">{formatCurrency(product.totalSpent)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
