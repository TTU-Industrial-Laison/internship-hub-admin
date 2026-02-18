import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getStore } from "@/lib/store/store";
import { setCsrfToken, clearCredentials } from "@/lib/store/slices/auth-slice";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// Track refreshing state
let isRefreshing = false;

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ✅ Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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

  if (tokenFromStore) {
    config.headers["X-XSRF-TOKEN"] = tokenFromStore;
  }

  return config;
});

// ✅ Attach interceptor for Response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!axios.isAxiosError(error) || !error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Handle 401 Unauthorized (Token expired)
    if (status === 401 && !originalRequest._retry) {
      // Don't refresh if we are already trying to login or refresh
      if (
        originalRequest.url === API_ENDPOINTS.AUTH.LOGIN ||
        originalRequest.url === API_ENDPOINTS.AUTH.REFRESH_TOKEN
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["X-XSRF-TOKEN"] = token as string;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
        const { csrfToken } = response.data;

        if (csrfToken) {
          // Update store and localStorage
          const store = getStore();
          if (store) {
            store.dispatch(setCsrfToken(csrfToken));
          }
          localStorage.setItem("csrf_token", csrfToken);

          // Process queued requests
          processQueue(null, csrfToken);

          // Retry original request
          originalRequest.headers["X-XSRF-TOKEN"] = csrfToken;
          return api(originalRequest);
        }
      } catch (refreshError) {
        const errorToProcess = refreshError instanceof Error ? refreshError : new Error(String(refreshError));
        processQueue(errorToProcess, null);

        // Final fallback: Clear credentials and redirect
        const store = getStore();
        if (store) {
          store.dispatch(clearCredentials());
        }
        localStorage.removeItem("csrf_token");

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Default error handling for other statuses
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);
