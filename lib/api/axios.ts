import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants/api-endpoints";
import { getStore } from "@/lib/store/store";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// Error handler function
const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
  // Handle unauthorized globally
  if (error.response?.status === 401 || error.response?.status === 403) {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;

      if (currentPath.startsWith("/dashboard")) {
        localStorage.removeItem("csrf_token");
        window.location.href = "/auth/login";
      }
    }
  }

  const message =
    // error.response?.data?.error ||
    error.response?.data?.message || error.message;

  return Promise.reject(new Error(message));
};

// ✅ Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// ✅ Attach interceptor for Request (to add XSRF token)
api.interceptors.request.use((config) => {
  const store = getStore();
  const state = store?.getState();
  let tokenFromStore: string | null = state?.auth?.csrfToken ?? null;

  // Fallback to localStorage if not in store (e.g. on page reload)
  if (!tokenFromStore && typeof window !== "undefined") {
    tokenFromStore = localStorage.getItem("csrf_token");
  }

  console.log("Interceptor Token:", tokenFromStore);

  if (tokenFromStore) {
    config.headers["X-XSRF-TOKEN"] = tokenFromStore;
    return config;
  }

  return config;
});

// ✅ Attach interceptor for Response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      return handleApiError(error);
    }

    return Promise.reject(error);
  }
);
