import { UserResponse } from "./user-response.model";

export interface SignInResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  errors: string[];
  user: UserResponse;
}
