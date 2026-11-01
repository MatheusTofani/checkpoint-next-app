import axios, { AxiosError } from "axios";

// Chamada direta à NUC API. Só para o servidor (Server Actions / Route Handlers),
// por exemplo o login, que ainda não tem sessão.
export const nucApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NUC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Cliente usado pelos hooks no browser. Vai para o BFF em src/app/api/[...path],
// que injeta o token da sessão e repassa para a NUC API.
const api = axios.create({
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Sessão expirada/inválida no backend: limpa o cookie e volta para o login
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      // /logout é um Route Handler (limpa o cookie), precisa de navegação completa
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/logout";
    }
    return Promise.reject(error);
  }
);

export default api;

// Formato de erro retornado pelo ExceptionMiddleware da API
export type ApiErrorResponse = {
  title?: string;
  errorCode?: number;
  details?: string[];
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro inesperado"
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.details?.length) return data.details.join(", ");
    if (data?.title) return data.title;
    if (!error.response) return "Não foi possível conectar ao servidor";
  }
  return fallback;
}
