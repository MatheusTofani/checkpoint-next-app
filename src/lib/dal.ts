import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";

// Garante que existe uma sessão válida; caso contrário, manda para o login.
// Use em Server Components, Server Actions e Route Handlers protegidos.
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/logout");
  return session;
});

export async function getCurrentUser() {
  const { user, profiles, profileId } = await verifySession();
  return { ...user, profiles, profileId };
}

// Headers para chamar a API autenticado a partir do servidor:
// api.get("/api/Lead", { headers: await getAuthHeaders() })
export async function getAuthHeaders() {
  const { token, profileId } = await verifySession();
  return {
    Authorization: `Bearer ${token}`,
    ...(profileId && { "X-Profile-Id": profileId }),
  };
}
