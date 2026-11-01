import type { FilterBaseParams, PaginationResponse } from "../common/commonModels";

export interface PurchaseItemResponse {
  productId: string;
  name: string;
  quantity: number;
  /** Valor pago pela quantidade inteira do item. */
  price: number;
  unitPrice: number;
  /** Onde o produto foi comprado (loja, pedido etc.). */
  link: string | null;
}

export interface PurchaseResponse {
  id: string;
  items: PurchaseItemResponse[];
  purchasedAt: string;
  total: number;
}

export type GetPurchasesResponse = PaginationResponse<PurchaseResponse>;

export interface GetPurchasesParams extends FilterBaseParams {
  PurchasedFrom?: string;
  PurchasedTo?: string;
  ProductId?: string;
}

export interface PurchaseItemRequest {
  productId: string;
  quantity: number;
  /** Valor pago pela quantidade inteira do item. */
  price: number;
  /** Onde o produto foi comprado; precisa ser http(s). */
  link?: string;
}

export interface CreatePurchaseRequest {
  items: PurchaseItemRequest[];
  purchasedAt: string;
}

/** Só os campos enviados são alterados; `items` substitui a lista inteira. */
export interface UpdatePurchaseRequest {
  items?: PurchaseItemRequest[];
  purchasedAt?: string;
}
