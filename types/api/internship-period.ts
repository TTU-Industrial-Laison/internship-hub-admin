import { ApiPaginatedResponse } from "../common/pagination";

export interface InternshipPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "ONGOING" | "COMPLETED";
  description?: string;
  eligibleCategories: string[];
}

export type InternshipPeriodsResponse = ApiPaginatedResponse<InternshipPeriod>;


export interface MultiSelectOption {
  label: string;
  value: string;
  description?: string;
}

export interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  options: MultiSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  hasError?: boolean;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
}