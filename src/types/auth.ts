// types/auth.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  username: string;
  // Optional fields for future expansion
  email?: string;
  created_at?: string;
  last_login?: string;
  profile_picture?: string;
}