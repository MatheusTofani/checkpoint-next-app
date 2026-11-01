import { nucApi } from "../../api";
import { AuthenticationRequest, AuthenticationResponse } from "./authenticationModels";

// Usado só no servidor (Server Action de login): a sessão é gravada em cookie httpOnly,
// por isso não há hook de React Query para autenticação.
export class AuthenticationApi {
  #route = "/api/Authentication";

  async login(request: AuthenticationRequest) {
    return await nucApi.post<AuthenticationResponse>(`${this.#route}/login`, request);
  }
}
