export interface FilterState {
  searchTerm: string;
  status: string;
  page: number;
  size: number;
  [key: string]: string | number; // For dynamic params
}

export interface EntityFilters {
  internshipPeriods: FilterState;
}
