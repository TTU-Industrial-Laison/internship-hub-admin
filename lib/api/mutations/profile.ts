import { api } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";

export const profileMutationsApi = {
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.patch(
      API_ENDPOINTS.PROFILE.UPLOAD_PROFILE_PICTURE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
