import { api } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { InternshipPeriodsResponse } from "@/types/api/internship-period";
import { ApiQueryParams } from "@/types/common/filter-config";

export const internshipApi = {
  getAllInternshipPeriods: async (params: ApiQueryParams) => {
    const response = await api.get<InternshipPeriodsResponse>(
      API_ENDPOINTS.INTERNSHIP.PERIODS,
      { params },
    );
    return response.data;
  },
};
