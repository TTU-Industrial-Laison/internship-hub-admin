"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FilterState } from "@/types/store/search-filter";

interface ActiveFiltersProps {
  filters: FilterState;
  statusName?: string;
  isLoading?: boolean;
  resetFilters: () => void;
}

const FilterBadge = ({ label, value }: { label: string; value: string }) => (
  <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
    {label}: {value}
  </span>
);

export const ActiveFilters = ({
  filters,
  isLoading,
  statusName = "Status",
  resetFilters,
}: ActiveFiltersProps) => {
  const filterMap: { key: string; label: string }[] = [
    { key: "searchTerm", label: "Search" },
    { key: "status", label: statusName },
    { key: "startDate", label: "From" },
    { key: "endDate", label: "Until" },
  ];

  const formatValue = (key: string, value: string) => {
    if (key === "startDate" || key === "endDate") {
      try {
        return format(new Date(value), "MMM d, yyyy");
      } catch (e) {
        return value;
      }
    }
    return value;
  };

  const activeBadges = filterMap
    .filter(({ key }) => filters[key])
    .map(({ key, label }) => {
      // Don't show badge for empty search
      if (key === "searchTerm" && !filters[key].trim()) return null;
      if (key === "status" && (filters[key] === "ALL" || !filters[key]))
        return null;

      return (
        <FilterBadge
          key={key}
          label={label}
          value={formatValue(key, filters[key] as string)}
        />
      );
    })
    .filter(Boolean);

 
  const hasFilters = activeBadges.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 my-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-slate-700">Active filters:</span>
        {activeBadges}
      </div>

      <Button
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className="h-7 rounded-full text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={resetFilters}
      >
        <X size={14} />
        Clear Filters
      </Button>
    </div>
  );
};
