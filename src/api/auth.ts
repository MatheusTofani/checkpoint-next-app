import { api } from "@/src/api/api";

export type AuthenticationRequest = {
  email: string;
  password: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthenticatedProfile = {
  id: string;
  name: string;
  type: string;
};

export type AuthenticationResponse = {
  token: string;
  expiresAt: string;
  user: AuthenticatedUser;
  profiles: AuthenticatedProfile[];
};

export async function authenticate(request: AuthenticationRequest) {
  const { data } = await api.post<AuthenticationResponse>(
    "/api/Authentication/login",
    request
  );
  return data;
}
