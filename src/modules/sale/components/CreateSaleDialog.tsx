"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import { useLeadApi } from "@/src/api/routes/lead/useLeadApi";
import type {
  CreateSaleRequest,
  PaymentMethodKey,
  SaleLocationKey,
} from "@/src/api/routes/sale/saleModels";
import { useSaleApi } from "@/src/api/routes/sale/useSaleApi";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/src/components/ui/native-select";
import { Spinner } from "@/src/components/ui/spinner";
import { dateInputToIso, parseDecimal, todayInputValue } from "@/src/lib/format";
import {
  createItemDraft,
  parseItems,
  ProductItemsField,
  type ItemDraft,
} from "@/src/modules/common/components/ProductItemsField";
import { locationOptions, paymentMethodOptions } from "../saleOptions";

type FieldErrors = Partial<Record<"items" | "soldAt" | "discount", string>>;

// Lista simples para o select; suficiente enquanto a base é pequena
const LEAD_OPTIONS_PARAMS = { PageSize: 100 };

export function CreateSaleDialog() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ItemDraft[]>(() => [createItemDraft()]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Lido ao abrir (e não no render) para não fixar a data no prerender
  const [today, setToday] = useState("");
  const { CreateSale } = useSaleApi();
  const createSale = CreateSale();
  const { GetLeads } = useLeadApi();
  const leads = GetLeads(LEAD_OPTIONS_PARAMS, { enabled: open });

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) setToday(todayInputValue());
    if (!value) {
      setItems([createItemDraft()]);
      setFieldErrors({});
      createSale.reset();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const soldAt = String(formData.get("soldAt") ?? "");
    const discountText = String(formData.get("discount") ?? "").trim();
    const discount = discountText ? parseDecimal(discountText) : undefined;
    const parsed = parseItems(items);

    const errors: FieldErrors = {};
    if (parsed.error) errors.items = parsed.error;
    if (!soldAt) errors.soldAt = "Informe a data";
    if (discount !== undefined && (!Number.isFinite(discount) || discount < 0)) {
      errors.discount = "Informe um desconto válido";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length || !parsed.items) return;

    const request: CreateSaleRequest = {
      items: parsed.items.map(({ productId, quantity, price }) => ({
        productId,
        quantity,
        unitPrice: price,
      })),
      soldAt: dateInputToIso(soldAt),
      leadId: String(formData.get("leadId") ?? "") || undefined,
      paymentMethod: formData.get("paymentMethod") as PaymentMethodKey,
      location: formData.get("location") as SaleLocationKey,
      discount,
    };

    createSale.mutate(request, {
      onSuccess: () => handleOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        Nova venda
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Nova venda</DialogTitle>
            <DialogDescription>Registre os itens vendidos e o pagamento.</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {createSale.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getApiErrorMessage(createSale.error, "Não foi possível registrar a venda")}
                </AlertDescription>
              </Alert>
            )}

            <ProductItemsField
              items={items}
              onChange={setItems}
              priceMode="unit"
              error={fieldErrors.items}
              disabled={createSale.isPending}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!fieldErrors.soldAt}>
                <FieldLabel htmlFor="sale-sold-at">Data</FieldLabel>
                <Input
                  id="sale-sold-at"
                  name="soldAt"
                  type="date"
                  defaultValue={today}
                  aria-invalid={!!fieldErrors.soldAt}
                />
                <FieldError>{fieldErrors.soldAt}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="sale-lead">Lead (opcional)</FieldLabel>
                <NativeSelect
                  id="sale-lead"
                  name="leadId"
                  className="w-full"
                  disabled={leads.isPending}
                >
                  <NativeSelectOption value="">
                    {leads.isPending ? "Carregando..." : "Sem lead"}
                  </NativeSelectOption>
                  {leads.data?.items.map((lead) => (
                    <NativeSelectOption key={lead.id} value={lead.id}>
                      {lead.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <Field>
                <FieldLabel htmlFor="sale-payment">Pagamento</FieldLabel>
                <NativeSelect id="sale-payment" name="paymentMethod" className="w-full">
                  {paymentMethodOptions.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>

              <Field>
                <FieldLabel htmlFor="sale-location">Local</FieldLabel>
                <NativeSelect id="sale-location" name="location" className="w-full">
                  {locationOptions.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldDescription>Vendas na loja têm 20% de desconto automático.</FieldDescription>
              </Field>
            </div>

            <Field data-invalid={!!fieldErrors.discount}>
              <FieldLabel htmlFor="sale-discount">Desconto extra em R$ (opcional)</FieldLabel>
              <Input
                id="sale-discount"
                name="discount"
                inputMode="decimal"
                placeholder="0,00"
                aria-invalid={!!fieldErrors.discount}
              />
              <FieldError>{fieldErrors.discount}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={createSale.isPending}>
              {createSale.isPending && <Spinner />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
