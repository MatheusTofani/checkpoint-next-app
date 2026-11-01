import api from "../../api";
import { CreateLeadRequest, GetLeadsParams, GetLeadsResponse, LeadDetailsResponse, LeadResponse, UpdateLeadRequest } from "./leadModels";

export class LeadApi {
  #route = "/api/Lead";

  async getLeads(params?: GetLeadsParams) {
    return await api.get<GetLeadsResponse>(this.#route, { params });
  }

  /** Lead com o resumo de compras (totais, produtos e vendas). */
  async getLeadById(id: string) {
    return await api.get<LeadDetailsResponse>(`${this.#route}/${id}`);
  }

  async createLead(request: CreateLeadRequest) {
    return await api.post<LeadResponse>(this.#route, request);
  }

  async updateLead(id: string, request: UpdateLeadRequest) {
    return await api.patch<LeadResponse>(`${this.#route}/${id}`, request);
  }

  async deleteLead(id: string) {
    return await api.delete<void>(`${this.#route}/${id}`);
  }
}
