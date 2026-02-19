import { api } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import {
    SupervisionOverallStats,
    SupervisionProgressData,
} from "@/types/api/supervision";

export const supervisionApi = {
    getOverallStats: async (internshipPeriodId?: string) => {
        const response = await api.get<SupervisionOverallStats>(
            API_ENDPOINTS.SUPERVISION.STATS_OVERALL,
            {
                params: { internshipPeriodId },
            },
        );
        return response.data;
    },
    getProgressChart: async (params: {
        internshipPeriodId?: string;
        interval: "weekly" | "monthly";
    }) => {
        const response = await api.get<SupervisionProgressData[]>(
            API_ENDPOINTS.SUPERVISION.PROGRESS_CHART,
            {
                params,
            },
        );
        return response.data;
    },
};
