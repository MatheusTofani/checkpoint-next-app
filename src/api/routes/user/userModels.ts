export interface CreateUserRequest {
  name: string;
  email: string;
  cpf?: string;
  password: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  type: string;
}

export interface UserCreatedResponse {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  profiles: UserProfileResponse[];
}
