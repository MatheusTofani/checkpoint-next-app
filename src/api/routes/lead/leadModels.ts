import type { FilterBaseParams, PaginationResponse } from "../common/commonModels";
import type { SaleResponse } from "../sale/saleModels";

export interface LeadResponse {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export type GetLeadsResponse = PaginationResponse<LeadResponse>;

export interface GetLeadsParams extends FilterBaseParams {
  Name?: string;
  Email?: string;
  Phone?: string;
}

export interface LeadSoldProductResponse {
  productId: string;
  name: string;
  quantity: number;
  totalSpent: number;
  lastSoldAt: string;
}

export interface LeadDetailsResponse {
  lead: LeadResponse;
  salesCount: number;
  totalSpent: number;
  totalDiscount: number;
  averageTicket: number;
  firstSaleAt: string | null;
  lastSaleAt: string | null;
  products: LeadSoldProductResponse[];
  sales: SaleResponse[];
}

export interface CreateLeadRequest {
  name: string;
  email?: string;
  phone?: string;
}

/** Só os campos enviados são alterados. */
export interface UpdateLeadRequest {
  name?: string;
  email?: string;
  phone?: string;
}
