"use client";

import React from "react";
import { useGetAllInternshipPeriods } from "@/lib/hooks/queries/use-internship-queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface PeriodSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function PeriodSelector({ value, onValueChange }: PeriodSelectorProps) {
  const { data: periods, isLoading } = useGetAllInternshipPeriods({
    page: 1,
    limit: 100, // Get all periods for the dropdown
  });

  if (isLoading) {
    return <Skeleton className="h-9 w-[200px]" />;
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[250px] bg-white">
        <SelectValue placeholder="Select Internship Period" />
      </SelectTrigger>
      <SelectContent>
        {periods?.data.map((period) => (
          <SelectItem key={period.id} value={period.id}>
            {period.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
