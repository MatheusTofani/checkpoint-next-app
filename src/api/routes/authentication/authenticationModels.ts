export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthenticatedProfile {
  id: string;
  name: string;
  type: string;
}

export interface AuthenticationResponse {
  token: string;
  expiresAt: string;
  user: AuthenticatedUser;
  profiles: AuthenticatedProfile[];
}
