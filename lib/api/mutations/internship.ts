import { api } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { InternshipPeriodValues } from "@/lib/validations/forms/internship-period";
import { InternshipPeriod } from "@/types/api/internship-period";

export const internshipMutationsApi = {
  createInternshipPeriod: async (data: InternshipPeriodValues) => {
    const response = await api.post<InternshipPeriod>(
      API_ENDPOINTS.INTERNSHIP.PERIODS,
      data
    );
    return response.data;
  },

  updateInternshipPeriod: async ({
    id,
    data,
  }: {
    id: string;
    data: InternshipPeriodValues;
  }) => {
    const response = await api.patch<InternshipPeriod>(
      `${API_ENDPOINTS.INTERNSHIP.PERIODS}/${id}`,
      data
    );
    return response.data;
  },

  deleteInternshipPeriod: async (id: string) => {
    await api.delete(`${API_ENDPOINTS.INTERNSHIP.PERIODS}/${id}`);
  },
};
