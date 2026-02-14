export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string | null;
  isVerified: boolean;
  isOnboarded: boolean;
  shouldResetPassword: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  csrfToken: string | null;
  isUploadingImage?: boolean;
}

export interface LoginResponse {
  csrfToken: string;
  message: string;
}
