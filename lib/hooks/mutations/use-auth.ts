import { useMutation } from "@tanstack/react-query";
import { authMutationsApi } from "@/lib/api/mutations/auth";
import { toast } from "@/lib/providers/toaster-provider";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  setCredentials,
  clearCredentials,
} from "@/lib/store/slices/auth-slice";
import { api } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import {
  ForgotPasswordValues,
  LoginValues,
  RegisterStudentValues,
  ResendVerificationValues,
  ResetPasswordValues,
  VerifyEmailValues,
  ChangePasswordValues,
} from "@/lib/validations/forms/auth";

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: LoginValues) => authMutationsApi.login(data),
    onSuccess: async (data) => {
      toast.success(data.message ?? "Logged in successfully");

      // Fetch session data and store in Redux
      try {
        const sessionResponse = await api.get(API_ENDPOINTS.AUTH.SESSION);
        if (sessionResponse.data?.id) {
          localStorage.setItem("csrf_token", data.csrfToken);
          dispatch(
            setCredentials({
              user: sessionResponse.data,
              csrfToken: data.csrfToken,
            })
          );

          // Redirect to change-password if required
          if (sessionResponse.data.shouldResetPassword) {
            router.push("/auth/change-password");
            return;
          }
        }
      } catch (error) {
        console.error("Session fetch failed after login:", error);
        toast.error("Failed to initialize session. Please check your connection.");
      }

      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error(error.message ?? "Failed to login");
    },
  });
};

export const useRegisterStudent = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterStudentValues) =>
      authMutationsApi.registerStudent(data),
    onSuccess: (data, variables) => {
      toast.success(data.message ?? "Registration successful");
      // Pass email to verify page via query param
      const params = new URLSearchParams();
      params.set("email", variables.email);
      router.push(`/auth/verify-email?${params.toString()}`);
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast.error(error.message ?? "Failed to register");
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyEmailValues) => authMutationsApi.verifyEmail(data),
    onSuccess: (data) => {
      toast.success(data.message ?? "Email verified successfully");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Verification error:", error);
      toast.error(error.message ?? "Failed to verify email");
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (data: ResendVerificationValues) =>
      authMutationsApi.resendVerification(data),
    onSuccess: (data) => {
      toast.success(data.message ?? "Verification code sent");
    },
    onError: (error) => {
      console.error("Resend verification error:", error);
      toast.error(error.message ?? "Failed to resend code");
    },
  });
};

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ForgotPasswordValues) =>
      authMutationsApi.forgotPassword(data),
    onSuccess: (data, variables) => {
      toast.success(data.message ?? "Password reset link sent to your email");
      const params = new URLSearchParams();
      params.set("email", variables.email);
      router.push(`/auth/reset-password?${params.toString()}`);
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
      toast.error(error.message ?? "Failed to send reset link");
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordValues) =>
      authMutationsApi.resetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message ?? "Password reset successfully");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Reset password error:", error);
      toast.error(error.message ?? "Failed to reset password");
    },
  });
};

export const useChangePassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: ChangePasswordValues) =>
      authMutationsApi.changePassword(data),
    onSuccess: async (data) => {
      toast.success(data.message ?? "Password changed successfully");

      // Clear credentials and redirect to login as per "Please log in again" requirement
      dispatch(clearCredentials());
      localStorage.removeItem("csrf_token");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Change password error:", error);
      toast.error(error.message ?? "Failed to change password");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => authMutationsApi.logout(),
    onSuccess: (data) => {
      toast.success(data.message ?? "Logged out successfully");

      // Clear Redux state
      dispatch(clearCredentials());

      // Clean up localStorage
      localStorage.removeItem("csrf_token");

      // Redirect to login
      router.push("/auth/login");
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
      toast.error(error.message ?? "Failed to logout");
    },
  });
};
