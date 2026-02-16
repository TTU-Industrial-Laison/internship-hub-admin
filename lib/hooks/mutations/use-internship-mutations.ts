import { useMutation, useQueryClient } from "@tanstack/react-query";
import { internshipMutationsApi } from "@/lib/api/mutations/internship";
import { toast } from "@/lib/providers/toaster-provider";
import {
  InternshipPeriodInputValues,
  internshipPeriodSchema,
} from "@/lib/validations/forms/internship-period";

export const useMutateInternshipPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id?: string;
      data: InternshipPeriodInputValues;
    }) => {
      // Handle the transformation from Date objects to ISO strings here
      const values = internshipPeriodSchema.parse(data);

      return id
        ? internshipMutationsApi.updateInternshipPeriod({ id, data: values })
        : internshipMutationsApi.createInternshipPeriod(values);
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["internship-periods"] });
      toast.success(
        variables.id ? "Internship period updated successfully" : "Internship period created successfully"
      );
    },

    onError: (err) => {
      toast.error(err.message || "Failed to save internship period");
    },

    onSettled: () => {
      // Always refetch after error or success to ensure server sync
      queryClient.invalidateQueries({ queryKey: ["internship-periods"] });
    },
  });
};
export const useDeleteInternshipPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      internshipMutationsApi.deleteInternshipPeriod(id),

    onSuccess: () => {
      toast.success("Internship period deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["internship-periods"] });
    },

    onError: (err) => {
      toast.error(err.message || "Failed to delete internship period");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["internship-periods"] });
    },
  });
};
