"use client";

import { LinkIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useProductApi } from "@/src/api/routes/product/useProductApi";
import { Button } from "@/src/components/ui/button";
import { FieldError, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/src/components/ui/input-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/src/components/ui/native-select";
import { formatCurrency, parseDecimal } from "@/src/lib/format";
import { cn } from "@/src/lib/utils";

export interface ItemDraft {
  key: number;
  productId: string;
  quantity: string;
  price: string;
  link: string;
}

let nextKey = 0;
export function createItemDraft(): ItemDraft {
  return { key: nextKey++, productId: "", quantity: "1", price: "", link: "" };
}

function isValidLink(value: string) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

/** "unit": preço por unidade (vendas). "total": valor pago pelo item inteiro (compras). */
export type PriceMode = "unit" | "total";

export function itemTotal(item: ItemDraft, priceMode: PriceMode) {
  const price = parseDecimal(item.price);
  const quantity = Number(item.quantity);
  if (!Number.isFinite(price)) return 0;
  return priceMode === "unit" ? price * (Number.isFinite(quantity) ? quantity : 0) : price;
}

/** Valida e converte os itens; retorna a mensagem de erro se algum estiver inválido. */
export function parseItems(items: ItemDraft[]) {
  if (!items.length) return { error: "Adicione pelo menos um item" };

  const parsed = items.map((item) => ({
    productId: item.productId,
    quantity: Number(item.quantity),
    price: parseDecimal(item.price),
    link: item.link.trim() || undefined,
  }));

  const invalid = parsed.some(
    (item) =>
      !item.productId ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0 ||
      !Number.isFinite(item.price) ||
      item.price < 0
  );
  if (invalid) return { error: "Preencha produto, quantidade e preço de todos os itens" };
  if (parsed.some((item) => item.link && !isValidLink(item.link))) {
    return { error: "Os links devem começar com http:// ou https://" };
  }

  return { items: parsed };
}

interface ProductItemsFieldProps {
  items: ItemDraft[];
  onChange: (items: ItemDraft[]) => void;
  priceMode: PriceMode;
  /** Mostra um campo de link por item (compras). */
  withLink?: boolean;
  error?: string;
  disabled?: boolean;
}

// Lista simples para o select; suficiente enquanto o catálogo é pequeno
const PRODUCT_OPTIONS_PARAMS = { PageSize: 100 };

export function ProductItemsField({
  items,
  onChange,
  priceMode,
  withLink,
  error,
  disabled,
}: ProductItemsFieldProps) {
  const { GetProducts } = useProductApi();
  const { data, isPending } = GetProducts(PRODUCT_OPTIONS_PARAMS);
  const products = data?.items ?? [];

  const update = (key: number, changes: Partial<ItemDraft>) => {
    onChange(items.map((item) => (item.key === key ? { ...item, ...changes } : item)));
  };

  const handleProductChange = (item: ItemDraft, productId: string) => {
    const product = products.find((p) => p.id === productId);
    // Em vendas o preço de tabela é um bom ponto de partida
    const price =
      priceMode === "unit" && product && !item.price ? String(product.price) : item.price;
    update(item.key, { productId, price });
  };

  const total = items.reduce((sum, item) => sum + itemTotal(item, priceMode), 0);
  const priceLabel = priceMode === "unit" ? "Preço unit." : "Valor pago";

  return (
    <div className="grid gap-2" data-invalid={!!error}>
      <FieldLabel>Itens</FieldLabel>

      {items.map((item, index) => (
        <div
          key={item.key}
          className={cn(
            "grid grid-cols-[1fr_4.5rem_6rem_auto] items-end gap-2",
            withLink && "border-b pb-2"
          )}
        >
          <NativeSelect
            className="w-full"
            aria-label={`Produto do item ${index + 1}`}
            value={item.productId}
            onChange={(event) => handleProductChange(item, event.target.value)}
            disabled={disabled || isPending}
          >
            <NativeSelectOption value="">
              {isPending ? "Carregando..." : "Produto"}
            </NativeSelectOption>
            {products.map((product) => (
              <NativeSelectOption key={product.id} value={product.id}>
                {product.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Input
            aria-label={`Quantidade do item ${index + 1}`}
            inputMode="numeric"
            placeholder="Qtd."
            value={item.quantity}
            onChange={(event) => update(item.key, { quantity: event.target.value })}
            disabled={disabled}
          />
          <Input
            aria-label={`${priceLabel} do item ${index + 1}`}
            inputMode="decimal"
            placeholder={priceLabel}
            value={item.price}
            onChange={(event) => update(item.key, { price: event.target.value })}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remover item ${index + 1}`}
            onClick={() => onChange(items.filter((i) => i.key !== item.key))}
            disabled={disabled || items.length === 1}
          >
            <Trash2Icon />
          </Button>
          {withLink && (
            <InputGroup className="col-span-3">
              <InputGroupAddon>
                <LinkIcon />
              </InputGroupAddon>
              <InputGroupInput
                type="url"
                aria-label={`Link de compra do item ${index + 1}`}
                placeholder="Link onde comprou (opcional)"
                value={item.link}
                onChange={(event) => update(item.key, { link: event.target.value })}
                disabled={disabled}
              />
            </InputGroup>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, createItemDraft()])}
          disabled={disabled}
        >
          <PlusIcon data-icon="inline-start" />
          Adicionar item
        </Button>
        <span className="text-sm">
          Itens: <strong className="tabular-nums">{formatCurrency(total)}</strong>
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Colunas: produto, quantidade e {priceMode === "unit" ? "preço por unidade" : "valor pago pelo item inteiro"}
        {withLink && ", com o link de onde cada produto foi comprado"}.
      </p>
      <FieldError>{error}</FieldError>
    </div>
  );
}
