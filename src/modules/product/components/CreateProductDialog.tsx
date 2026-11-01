"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import type { CreateProductRequest } from "@/src/api/routes/product/productModels";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Spinner } from "@/src/components/ui/spinner";
import { Textarea } from "@/src/components/ui/textarea";

type FieldErrors = Partial<Record<keyof CreateProductRequest, string>>;

function parseForm(formData: FormData) {
  const request: CreateProductRequest = {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    price: Number(String(formData.get("price") ?? "").replace(",", ".")),
  };

  const errors: FieldErrors = {};
  if (!request.name) errors.name = "Informe o nome";
  if (!request.brand) errors.brand = "Informe a marca";
  if (!request.category) errors.category = "Informe a categoria";
  if (!Number.isFinite(request.price) || request.price <= 0) {
    errors.price = "Informe um preço válido";
  }

  return { request, errors };
}

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { CreateProduct } = useProductApi();
  const createProduct = CreateProduct();

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setFieldErrors({});
      createProduct.reset();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { request, errors } = parseForm(new FormData(event.currentTarget));
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    createProduct.mutate(request, {
      onSuccess: () => handleOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        Novo produto
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Novo produto</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um produto.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {createProduct.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getApiErrorMessage(createProduct.error, "Não foi possível criar o produto")}
                </AlertDescription>
              </Alert>
            )}

            <Field data-invalid={!!fieldErrors.name}>
              <FieldLabel htmlFor="product-name">Nome</FieldLabel>
              <Input id="product-name" name="name" aria-invalid={!!fieldErrors.name} />
              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!fieldErrors.brand}>
                <FieldLabel htmlFor="product-brand">Marca</FieldLabel>
                <Input id="product-brand" name="brand" aria-invalid={!!fieldErrors.brand} />
                <FieldError>{fieldErrors.brand}</FieldError>
              </Field>

              <Field data-invalid={!!fieldErrors.category}>
                <FieldLabel htmlFor="product-category">Categoria</FieldLabel>
                <Input id="product-category" name="category" aria-invalid={!!fieldErrors.category} />
                <FieldError>{fieldErrors.category}</FieldError>
              </Field>
            </div>

            <Field data-invalid={!!fieldErrors.price}>
              <FieldLabel htmlFor="product-price">Preço (R$)</FieldLabel>
              <Input
                id="product-price"
                name="price"
                inputMode="decimal"
                placeholder="0,00"
                aria-invalid={!!fieldErrors.price}
              />
              <FieldError>{fieldErrors.price}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="product-description">Descrição</FieldLabel>
              <Textarea id="product-description" name="description" rows={3} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending && <Spinner />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
