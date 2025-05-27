export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
  errors: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  user?: User;
}
