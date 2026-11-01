"use client";

import type { PurchaseResponse } from "@/src/api/routes/purchase/purchaseModels";
import { usePurchaseApi } from "@/src/api/routes/purchase/usePurchaseApi";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { ConfirmDeleteDialog } from "@/src/modules/common/components/ConfirmDeleteDialog";

interface DeletePurchaseDialogProps {
  purchase: PurchaseResponse;
}

export function DeletePurchaseDialog({ purchase }: DeletePurchaseDialogProps) {
  const { DeletePurchase } = usePurchaseApi();
  const summary = `${formatDate(purchase.purchasedAt)} · ${formatCurrency(purchase.total)}`;

  return (
    <ConfirmDeleteDialog
      id={purchase.id}
      mutation={DeletePurchase()}
      title="Excluir compra?"
      description={
        <>
          A compra de <strong>{summary}</strong> será removida. Essa ação não
          pode ser desfeita.
        </>
      }
      label={`Excluir compra de ${summary}`}
      errorMessage="Não foi possível excluir a compra"
    />
  );
}
