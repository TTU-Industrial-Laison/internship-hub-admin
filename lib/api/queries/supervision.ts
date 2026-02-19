import { api } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { SupervisionOverallStats } from "@/types/api/supervision";

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
};
