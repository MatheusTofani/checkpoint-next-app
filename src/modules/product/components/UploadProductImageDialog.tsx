"use client";

import { useState, type FormEvent } from "react";
import { ImageUpIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import type { ProductResponse } from "@/src/api/routes/product/productModels";
import { useProductApi } from "@/src/api/routes/product/useProductApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Field, FieldError } from "@/src/components/ui/field";
import { Spinner } from "@/src/components/ui/spinner";
import { ProductImageInput, validateProductImage } from "./ProductImageInput";

interface UploadProductImageDialogProps {
  product: ProductResponse;
  onUploaded?: () => void;
}

export function UploadProductImageDialog({
  product,
  onUploaded,
}: UploadProductImageDialogProps) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>();
  const { UploadProductImage } = useProductApi();
  const uploadImage = UploadProductImage();

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setImage(null);
      setImageError(undefined);
      uploadImage.reset();
    }
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setImageError(file ? validateProductImage(file) : undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!image) return setImageError("Escolha uma imagem");
    if (imageError) return;

    uploadImage.mutate(
      { id: product.id, image },
      {
        onSuccess: () => {
          onUploaded?.();
          handleOpenChange(false);
        },
      }
    );
  };

  const action = product.hasImage ? "Trocar imagem" : "Adicionar imagem";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label={`${action} de ${product.name}`}
            className="shadow-sm"
          />
        }
      >
        <ImageUpIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{action}</DialogTitle>
            <DialogDescription>{product.name}</DialogDescription>
          </DialogHeader>

          {uploadImage.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {getApiErrorMessage(uploadImage.error, "Não foi possível enviar a imagem")}
              </AlertDescription>
            </Alert>
          )}

          <Field data-invalid={!!imageError}>
            <ProductImageInput
              value={image}
              onChange={handleImageChange}
              invalid={!!imageError}
              disabled={uploadImage.isPending}
            />
            <FieldError>{imageError}</FieldError>
          </Field>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={uploadImage.isPending || !image}>
              {uploadImage.isPending && <Spinner />}
              Enviar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
