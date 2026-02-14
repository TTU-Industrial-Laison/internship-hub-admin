import { api } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import {
  ForgotPasswordValues,
  LoginValues,
  RegisterStudentValues,
  ResendVerificationValues,
  VerifyEmailValues,
} from "@/lib/validations/forms/auth";
import { LoginResponse } from "@/types/auth";

export const authMutationsApi = {
  login: async (data: LoginValues) => {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );
    return response.data;
  },

  registerStudent: async (data: RegisterStudentValues) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER_STUDENT, data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailValues) => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
    return response.data;
  },

  resendVerification: async (data: ResendVerificationValues) => {
    const response = await api.post(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      data,
    );
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordValues) => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },
};
