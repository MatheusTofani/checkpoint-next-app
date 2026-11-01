import type { FilterBaseParams, PaginationResponse } from "../common/commonModels";

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
}

export type GetProductsResponse = PaginationResponse<ProductResponse>;

export interface GetProductsParams extends FilterBaseParams {
  Name?: string;
  Description?: string;
  Price?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
}
