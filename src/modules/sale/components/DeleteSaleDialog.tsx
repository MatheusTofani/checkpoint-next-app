"use client";

import type { SaleResponse } from "@/src/api/routes/sale/saleModels";
import { useSaleApi } from "@/src/api/routes/sale/useSaleApi";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { ConfirmDeleteDialog } from "@/src/modules/common/components/ConfirmDeleteDialog";

interface DeleteSaleDialogProps {
  sale: SaleResponse;
}

export function DeleteSaleDialog({ sale }: DeleteSaleDialogProps) {
  const { DeleteSale } = useSaleApi();
  const summary = `${formatDate(sale.soldAt)} · ${formatCurrency(sale.total)}`;

  return (
    <ConfirmDeleteDialog
      id={sale.id}
      mutation={DeleteSale()}
      title="Excluir venda?"
      description={
        <>
          A venda de <strong>{summary}</strong> será removida. Essa ação não
          pode ser desfeita.
        </>
      }
      label={`Excluir venda de ${summary}`}
      errorMessage="Não foi possível excluir a venda"
    />
  );
}
