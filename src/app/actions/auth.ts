"use server";

import { redirect } from "next/navigation";
import { getApiErrorMessage } from "@/src/api/api";
import { authenticate } from "@/src/api/auth";
import { createSession, deleteSession } from "@/src/lib/session";

export type LoginState = {
  email?: string;
  error?: string;
  fieldErrors?: { email?: string; password?: string };
};

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: LoginState["fieldErrors"] = {};
  if (!email) fieldErrors.email = "Informe o email";
  if (!password) fieldErrors.password = "Informe a senha";
  if (fieldErrors.email || fieldErrors.password) return { email, fieldErrors };

  try {
    const response = await authenticate({ email, password });
    await createSession({
      token: response.token,
      expiresAt: response.expiresAt,
      user: response.user,
      profiles: response.profiles,
      profileId: response.profiles[0]?.id ?? null,
    });
  } catch (error) {
    return { email, error: getApiErrorMessage(error, "Não foi possível entrar") };
  }

  // redirect lança uma exceção, por isso fica fora do try/catch
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
