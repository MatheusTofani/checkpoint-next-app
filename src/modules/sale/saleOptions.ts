import type { PaymentMethodKey, SaleLocationKey } from "@/src/api/routes/sale/saleModels";

export const paymentMethodOptions: { value: PaymentMethodKey; label: string }[] = [
  { value: "PIX", label: "PIX" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "CARTAO_CREDITO", label: "Cartão de Crédito" },
  { value: "CARTAO_DEBITO", label: "Cartão de Débito" },
];

export const locationOptions: { value: SaleLocationKey; label: string }[] = [
  { value: "LOJA", label: "Loja" },
  { value: "ONLINE", label: "Online" },
];
