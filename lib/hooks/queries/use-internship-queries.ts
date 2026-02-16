import { useQuery } from "@tanstack/react-query";
import { internshipApi } from "@/lib/api/queries/internship";
import { Query_Keys } from "@/lib/constants/query-keys";
import { ApiQueryParams } from "@/types/common/filter-config";

export const useGetAllInternshipPeriods = (params: ApiQueryParams) => {
  return useQuery({
    queryKey: Query_Keys.internship.all(params),
    queryFn: () => internshipApi.getAllInternshipPeriods(params),
    placeholderData: (previousData) => previousData,
  });
};
