import { ApiPaginatedResponse } from "../common/pagination";

export interface InternshipPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  description?: string;
  eligibleCategories: string[];
}

export type InternshipPeriodsResponse = ApiPaginatedResponse<InternshipPeriod>;
