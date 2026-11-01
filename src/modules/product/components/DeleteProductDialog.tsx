"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import type { ProductResponse } from "@/src/api/routes/product/productModels";
import { useProductApi } from "@/src/api/routes/product/useProductApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";

interface DeleteProductDialogProps {
  product: ProductResponse;
}

export function DeleteProductDialog({ product }: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { DeleteProduct } = useProductApi();
  const deleteProduct = DeleteProduct();

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) deleteProduct.reset();
  };

  const handleDelete = () => {
    deleteProduct.mutate(product.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Excluir ${product.name}`}
            className="text-muted-foreground hover:text-destructive"
          />
        }
      >
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
          <AlertDialogDescription>
            O produto <strong>{product.name}</strong> será removido. Essa ação
            não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteProduct.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {getApiErrorMessage(deleteProduct.error, "Não foi possível excluir o produto")}
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProduct.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending && <Spinner />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
