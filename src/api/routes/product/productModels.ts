import type { FilterBaseParams, PaginationResponse } from "../common/commonModels";

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imagePath: string | null;
  hasImage: boolean;
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

// Mesmas regras de UploadProductImage na API
export const PRODUCT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
