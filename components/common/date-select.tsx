"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { FilterState } from "@/types/store/search-filter";

interface DateRangeSelectProps {
  filters: FilterState;
  setDynamicParam: (key: string, value: string) => void;
}

export const DateRangeSelect = ({
  filters,
  setDynamicParam,
}: DateRangeSelectProps) => {
  const startDate = useMemo(
    () =>
      filters.startDate ? new Date(filters.startDate as string) : undefined,
    [filters.startDate]
  );

  const endDate = useMemo(
    () => (filters.endDate ? new Date(filters.endDate as string) : undefined),
    [filters.endDate]
  );

  const displayValue = useMemo(() => {
    if (startDate && endDate) {
      return `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    }
    if (startDate) return `From ${format(startDate, "MMM d, yyyy")}`;
    if (endDate) return `Until ${format(endDate, "MMM d, yyyy")}`;
    return "Select date range";
  }, [startDate, endDate]);

  const updateStartDate = (date: Date | undefined) => {
    if (date) {
      setDynamicParam("startDate", format(date, "yyyy-MM-dd'T'00:00:00"));
    } else {
      setDynamicParam("startDate", "");
    }
  };

  const updateEndDate = (date: Date | undefined) => {
    if (date) {
      setDynamicParam("endDate", format(date, "yyyy-MM-dd'T'23:59:59"));
    } else {
      setDynamicParam("endDate", "");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full h-9 hover:bg-transparent text-sm font-normal border border-gray-400 shadow-none min-w-65 hover:border-gray-400 transition-colors justify-start"
        >
          <div className="flex items-center gap-2 w-full">
            <CalendarIcon className="h-3.5! w-3.5!" strokeWidth={1.5} />
            <span className="truncate">{displayValue}</span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 space-y-3">
          {/* Start Date Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-600">Start Date</p>
              {startDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 rounded-full p-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
                  onClick={() => updateStartDate(undefined)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-8 text-sm justify-start text-left font-normal border border-gray-400 hover:bg-transparent"
                >
                  <CalendarIcon className="!h-3 !w-3 text-muted-foreground" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={updateStartDate}
                  disabled={(date: Date) => {
                    // Disable dates after endDate if endDate is set
                    if (endDate) {
                      return date > endDate;
                    }
                    return false;
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-600">End Date</p>
              {endDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 rounded-full w-6 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
                  onClick={() => updateEndDate(undefined)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-8 text-sm justify-start text-left font-normal border border-gray-400 hover:bg-transparent"
                >
                  <CalendarIcon className="!h-3 !w-3  text-muted-foreground" />
                  {endDate ? (
                    format(endDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={updateEndDate}
                  disabled={(date: Date) => {
                    // Disable dates before startDate if startDate is set
                    if (startDate) {
                      return date < startDate;
                    }
                    return false;
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
