import api from "../../api";
import { CreatePurchaseRequest, GetPurchasesParams, GetPurchasesResponse, PurchaseResponse, UpdatePurchaseRequest } from "./purchaseModels";

export class PurchaseApi {
  #route = "/api/Purchase";

  async getPurchases(params?: GetPurchasesParams) {
    return await api.get<GetPurchasesResponse>(this.#route, { params });
  }

  async getPurchaseById(id: string) {
    return await api.get<PurchaseResponse>(`${this.#route}/${id}`);
  }

  async createPurchase(request: CreatePurchaseRequest) {
    return await api.post<PurchaseResponse>(this.#route, request);
  }

  async updatePurchase(id: string, request: UpdatePurchaseRequest) {
    return await api.patch<PurchaseResponse>(`${this.#route}/${id}`, request);
  }

  async deletePurchase(id: string) {
    return await api.delete<void>(`${this.#route}/${id}`);
  }
}
