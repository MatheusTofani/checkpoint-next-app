import type { FilterBaseParams, PaginationResponse } from "../common/commonModels";

/** Chaves aceitas pela API (ela também aceita a descrição, ex.: "Cartão de Crédito"). */
export type PaymentMethodKey = "PIX" | "DINHEIRO" | "CARTAO_CREDITO" | "CARTAO_DEBITO";

/** Venda na loja tem 20% de desconto automático (locationDiscount). */
export type SaleLocationKey = "LOJA" | "ONLINE";

export interface SaleItemResponse {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SaleLeadResponse {
  id: string;
  name: string;
}

export interface SaleResponse {
  id: string;
  items: SaleItemResponse[];
  soldAt: string;
  lead: SaleLeadResponse | null;
  /** Vem como descrição: "PIX", "Dinheiro", "Cartão de Crédito", "Cartão de Débito". */
  paymentMethod: string;
  /** Vem como descrição: "Loja" ou "Online". */
  location: string;
  subtotal: number;
  discount: number;
  locationDiscount: number;
  appliedDiscount: number;
  total: number;
}

export type GetSalesResponse = PaginationResponse<SaleResponse>;

export interface GetSalesParams extends FilterBaseParams {
  SoldFrom?: string;
  SoldTo?: string;
  ProductId?: string;
  LeadId?: string;
  PaymentMethod?: PaymentMethodKey;
  Location?: SaleLocationKey;
}

export interface SaleItemRequest {
  productId: string;
  quantity: number;
  /** Valor vendido por unidade. */
  unitPrice: number;
}

export interface CreateSaleRequest {
  items: SaleItemRequest[];
  soldAt: string;
  leadId?: string;
  paymentMethod: PaymentMethodKey;
  location: SaleLocationKey;
  discount?: number;
}

/** Só os campos enviados são alterados; `items` substitui a lista inteira. */
export interface UpdateSaleRequest {
  items?: SaleItemRequest[];
  soldAt?: string;
  leadId?: string;
  removeLead?: boolean;
  paymentMethod?: PaymentMethodKey;
  location?: SaleLocationKey;
  discount?: number;
}
