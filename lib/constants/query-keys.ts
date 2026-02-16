import { ApiQueryParams } from "@/types/common/filter-config";

export const Query_Keys = {
  internship: {
    all: (params: ApiQueryParams) => ["internship-periods", JSON.stringify(params)],
    byId: (id: string) => ["internship-periods", id],
  },
} 
