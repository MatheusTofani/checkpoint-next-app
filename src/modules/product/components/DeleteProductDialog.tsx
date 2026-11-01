"use client";

import type { ProductResponse } from "@/src/api/routes/product/productModels";
import { useProductApi } from "@/src/api/routes/product/useProductApi";
import { ConfirmDeleteDialog } from "@/src/modules/common/components/ConfirmDeleteDialog";

interface DeleteProductDialogProps {
  product: ProductResponse;
}

export function DeleteProductDialog({ product }: DeleteProductDialogProps) {
  const { DeleteProduct } = useProductApi();

  return (
    <ConfirmDeleteDialog
      id={product.id}
      mutation={DeleteProduct()}
      title="Excluir produto?"
      description={
        <>
          O produto <strong>{product.name}</strong> será removido. Essa ação não
          pode ser desfeita.
        </>
      }
      label={`Excluir ${product.name}`}
      errorMessage="Não foi possível excluir o produto"
    />
  );
}
