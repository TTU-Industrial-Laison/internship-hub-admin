import { useMutation } from "@tanstack/react-query";
import { profileMutationsApi } from "@/lib/api/mutations/profile";
import { toast } from "@/lib/providers/toaster-provider";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/auth-slice";
import { api } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";

interface UseUploadProfileImageOptions {
  onSuccess?: () => void;
}

export const useUploadProfileImage = (
  options?: UseUploadProfileImageOptions
) => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (file: File) => profileMutationsApi.uploadProfileImage(file),
    onSuccess: async () => {
      toast.success("Profile picture updated successfully");

      if (options?.onSuccess) {
        options.onSuccess();
      }

      // Optimistically update or fetch fresh profile data
      try {
        const sessionResponse = await api.get(API_ENDPOINTS.AUTH.SESSION);
        if (sessionResponse.data?.id) {
          dispatch(setCredentials({ user: sessionResponse.data }));
        }
      } catch (error) {
        console.error("Failed to refresh session after upload", error);
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to upload image");
    },
  });
};
