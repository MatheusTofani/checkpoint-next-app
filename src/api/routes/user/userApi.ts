import api from "../../api";
import { CreateUserRequest, UserCreatedResponse } from "./userModels";

export class UserApi {
  #route = "/api/User";

  /** Rota pública na API enquanto não há usuários cadastrados. */
  async createUser(request: CreateUserRequest) {
    return await api.post<UserCreatedResponse>(this.#route, request);
  }
}
