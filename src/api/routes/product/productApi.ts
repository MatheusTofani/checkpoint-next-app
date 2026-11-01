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

  async deleteProduct(id: string) {
    return await api.delete<void>(`${this.#route}/${id}`);
  }
}
