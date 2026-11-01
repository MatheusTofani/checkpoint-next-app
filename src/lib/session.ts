import "server-only";
import { cookies } from "next/headers";
import type {
  AuthenticatedProfile,
  AuthenticatedUser,
} from "@/src/api/routes/authentication/authenticationModels";

export const SESSION_COOKIE = "checkpoint_session";

export type Session = {
  token: string;
  expiresAt: string;
  user: AuthenticatedUser;
  profiles: AuthenticatedProfile[];
  profileId: string | null;
};

function encode(session: Session) {
  return Buffer.from(JSON.stringify(session)).toString("base64url");
}

function decode(value: string | undefined): Session | null {
  if (!value) return null;
  try {
    const session = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8")
    ) as Session;
    if (!session.token || new Date(session.expiresAt) <= new Date()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function createSession(session: Session) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encode(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(session.expiresAt),
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return decode(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
