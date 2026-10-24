import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NUC_API_URL,
  headers: { "Content-Type": "application/json" },
});

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
