"use client";

import React, { Fragment, useEffect } from "react";
import { useGetAllInternshipPeriods } from "@/lib/hooks/queries/use-internship-queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectSelectedPeriodId,
  setSelectedPeriodId,
} from "@/lib/store/slices/dashboard-slice";
import { InternshipPeriod } from "@/types/api/internship-period";

interface PeriodSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function PeriodSelector({ value, onValueChange }: PeriodSelectorProps) {
  const dispatch = useAppDispatch();
  const reduxSelectedPeriodId = useAppSelector(selectSelectedPeriodId);

  const selectedPeriodId = value !== undefined ? value : reduxSelectedPeriodId;

  const { data: periods, isLoading } = useGetAllInternshipPeriods({
    page: 1,
    limit: 100, // Get all periods for the dropdown
  });

  useEffect(() => {
    if (!selectedPeriodId && periods?.data && periods.data.length > 0) {
      const ongoingPeriods = periods.data.filter(
        (p: InternshipPeriod) => p.status === "ONGOING"
      );

      if (ongoingPeriods.length > 0) {
        // Sort by startDate in descending order to get the latest ongoing period
        const latestOngoing = [...ongoingPeriods].sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )[0];

        // Trigger the selection
        if (onValueChange) {
          onValueChange(latestOngoing.id);
        } else {
          dispatch(setSelectedPeriodId(latestOngoing.id));
        }
      }
    }
  }, [periods, selectedPeriodId, dispatch, onValueChange]);

  const handleValueChange = (val: string) => {
    if (onValueChange) {
      onValueChange(val);
    } else {
      dispatch(setSelectedPeriodId(val));
    }
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-[200px]" />;
  }

  return (
    <Select
      value={selectedPeriodId ?? ""}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="bg-white shadow-card border-gray-300 rounded-lg">
        <SelectValue placeholder="Select Internship Period" />
      </SelectTrigger>
      <SelectContent>
        {periods?.data.map((period) => (
          <Fragment key={period.id}>
            <SelectItem value={period.id}>{period.name}</SelectItem>
            <SelectSeparator className="last:hidden" />
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}
