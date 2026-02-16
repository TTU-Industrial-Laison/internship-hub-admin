import { FilterConfig } from "@/types/common/filter-config";

export const FILTER_CONFIGS: Record<string, FilterConfig> = {
  INTERNSHIP_PERIODS: {
    searchParam: "name",
    statusParam: "status",
    dynamicParams: {
      startDate: "startDate",
      endDate: "endDate",
    },
  },
};
