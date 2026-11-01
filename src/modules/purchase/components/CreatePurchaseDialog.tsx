"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import type { CreatePurchaseRequest } from "@/src/api/routes/purchase/purchaseModels";
import { usePurchaseApi } from "@/src/api/routes/purchase/usePurchaseApi";
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
import { dateInputToIso, todayInputValue } from "@/src/lib/format";
import {
  createItemDraft,
  parseItems,
  ProductItemsField,
  type ItemDraft,
} from "@/src/modules/common/components/ProductItemsField";

type FieldErrors = Partial<Record<"items" | "purchasedAt", string>>;

export function CreatePurchaseDialog() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ItemDraft[]>(() => [createItemDraft()]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Lido ao abrir (e não no render) para não fixar a data no prerender
  const [today, setToday] = useState("");
  const { CreatePurchase } = usePurchaseApi();
  const createPurchase = CreatePurchase();

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) setToday(todayInputValue());
    if (!value) {
      setItems([createItemDraft()]);
      setFieldErrors({});
      createPurchase.reset();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const purchasedAt = String(formData.get("purchasedAt") ?? "");
    const parsed = parseItems(items);

    const errors: FieldErrors = {};
    if (parsed.error) errors.items = parsed.error;
    if (!purchasedAt) errors.purchasedAt = "Informe a data";
    setFieldErrors(errors);
    if (Object.keys(errors).length || !parsed.items) return;

    const request: CreatePurchaseRequest = {
      items: parsed.items,
      purchasedAt: dateInputToIso(purchasedAt),
    };

    createPurchase.mutate(request, {
      onSuccess: () => handleOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        Nova compra
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Nova compra</DialogTitle>
            <DialogDescription>Registre os produtos comprados para o estoque.</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {createPurchase.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getApiErrorMessage(createPurchase.error, "Não foi possível registrar a compra")}
                </AlertDescription>
              </Alert>
            )}

            <ProductItemsField
              items={items}
              onChange={setItems}
              priceMode="total"
              withLink
              error={fieldErrors.items}
              disabled={createPurchase.isPending}
            />

            <Field data-invalid={!!fieldErrors.purchasedAt} className="sm:max-w-48">
              <FieldLabel htmlFor="purchase-date">Data</FieldLabel>
              <Input
                id="purchase-date"
                name="purchasedAt"
                type="date"
                defaultValue={today}
                aria-invalid={!!fieldErrors.purchasedAt}
              />
              <FieldError>{fieldErrors.purchasedAt}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={createPurchase.isPending}>
              {createPurchase.isPending && <Spinner />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
