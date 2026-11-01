import api from "../../api";
import { CreateSaleRequest, GetSalesParams, GetSalesResponse, SaleResponse, UpdateSaleRequest } from "./saleModels";

export class SaleApi {
  #route = "/api/Sale";

  async getSales(params?: GetSalesParams) {
    return await api.get<GetSalesResponse>(this.#route, { params });
  }

  async getSaleById(id: string) {
    return await api.get<SaleResponse>(`${this.#route}/${id}`);
  }

  async createSale(request: CreateSaleRequest) {
    return await api.post<SaleResponse>(this.#route, request);
  }

  async updateSale(id: string, request: UpdateSaleRequest) {
    return await api.patch<SaleResponse>(`${this.#route}/${id}`, request);
  }

  async deleteSale(id: string) {
    return await api.delete<void>(`${this.#route}/${id}`);
  }
}
