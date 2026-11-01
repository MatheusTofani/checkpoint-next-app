import api from "../../api";
import { CreateProductRequest, GetProductsParams, GetProductsResponse, ProductResponse } from "./productModels";

export class ProductApi {
  #route = "/api/Product";

  async getProducts(params?: GetProductsParams) {
    return await api.get<GetProductsResponse>(this.#route, { params });
  }

  async getProductById(id: string) {
    return await api.get<ProductResponse>(`${this.#route}/${id}`);
  }

  async createProduct(request: CreateProductRequest) {
    return await api.post<ProductResponse>(this.#route, request);
  }

  async uploadProductImage(id: string, image: File) {
    const formData = new FormData();
    formData.append("Image", image);
    // Sem isso o axios serializa o FormData como JSON (Content-Type padrão da instância)
    return await api.patch<ProductResponse>(`${this.#route}/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /** URL da imagem via BFF; `version` evita cache ao trocar a imagem. */
  getProductImageUrl(id: string, version?: string | number) {
    const query = version !== undefined ? `?v=${encodeURIComponent(version)}` : "";
    return `${this.#route}/${id}/image${query}`;
  }

  async deleteProduct(id: string) {
    return await api.delete<void>(`${this.#route}/${id}`);
  }
}
