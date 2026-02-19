export const API_ENDPOINTS = {
  AUTH: {
    REGISTER_STUDENT: "/auth/student/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH_TOKEN: "/auth/refresh",
    SESSION: "/auth/session",
    LOGOUT: "/auth/logout",
    CHANGE_PASSWORD: "/auth/change-password",

    SUPERVISOR: {
      INVITE: "/auth/supervisor/invite",
      LIST: "/auth/supervisors",
      UPDATE_STATUS: (id: string | number) => `/auth/supervisor/${id}/status`,
    },
  },
  PROFILE: {
    GET_PROFILE: "/profile",
    UPDATE_PROFILE: (id: string | number) => `/profile/admin/${id}`,
    UPLOAD_PROFILE_PICTURE: "/profile/upload",
  },
  INTERNSHIP: {
    PERIODS: "/internship-periods",
  },
  SUPERVISION: {
    STATS_OVERALL: "/supervision/stats/overall",
    PROGRESS_CHART: "/supervision/stats/progress-chart",
    PIE_CHART: "/supervision/stats/pie-chart",
  },
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
