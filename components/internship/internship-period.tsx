"use client";

import { Fragment } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { SearchInput } from "@/components/common/search-input";
import { PaginationTabs } from "@/components/common/pagination";
import { ActiveFilters } from "@/components/common/active-filters";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { ErrorMessage } from "@/components/common/error-message";
import { DateRangeSelect } from "@/components/common/date-select";

import { useSearchFilter } from "@/lib/hooks/ui/use-search-filter";
import { useGetAllInternshipPeriods } from "@/lib/hooks/queries/use-internship-queries";
import { FILTER_CONFIGS } from "@/lib/constants/filter-configs";
import { INTERNSHIP_STATUS_OPTIONS } from "@/lib/constants/internship-period";
import { ERROR_MESSAGES } from "@/lib/constants/error-messages";

import { InternshipList } from "./internship-list";

export const InternshipPeriod = () => {
  const {
    filters,
    localSearchTerm,
    setLocalSearchTerm,
    setStatus,
    setPage,
    setDynamicParam,
    resetFilters,
    triggerSearch,
    getApiParams,
  } = useSearchFilter("internshipPeriods", FILTER_CONFIGS.INTERNSHIP_PERIODS);

  const {
    data: internshipData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllInternshipPeriods(getApiParams());

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Internship Periods</h3>
        <Button size="sm" className="rounded-full text-sm">
          <Plus strokeWidth={2.5} className="mr-1 h-4 w-4" /> Add Period
        </Button>
      </div>

      <div className="my-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-1/2">
          <SearchInput
            value={localSearchTerm}
            onChange={setLocalSearchTerm}
            onSearch={triggerSearch}
            placeholder="Search by period name"
            disabled={isLoading}
            isLoading={isFetching}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div>
            <Select
              value={filters.status || "ALL"}
              onValueChange={setStatus}
              disabled={isLoading}
            >
              <SelectTrigger className="rounded-full border border-gray-400 shadow-none min-w-[140px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent side="bottom">
                <SelectGroup>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <Separator />
                  {INTERNSHIP_STATUS_OPTIONS.map((option) => (
                    <Fragment key={option.value}>
                      <SelectItem value={option.value}>
                        {option.label}
                      </SelectItem>
                      <Separator className="last:hidden" />
                    </Fragment>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <DateRangeSelect
              filters={filters}
              setDynamicParam={setDynamicParam}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <ActiveFilters
        filters={filters}
        isLoading={isLoading}
        resetFilters={resetFilters}
        statusName="Status"
      />

      {isLoading && <SkeletonLoader type="table" count={5} />}

      {!isLoading && isError && (
        <ErrorMessage
          message={ERROR_MESSAGES.INTERNSHIP_PERIODS}
          refetch={refetch}
        />
      )}

      {!isLoading && !isError && (
        <>
          <InternshipList events={internshipData?.data || []} />

          <PaginationTabs
            page={internshipData?.meta?.page ?? filters.page}
            size={internshipData?.meta?.limit ?? filters.size}
            total={internshipData?.meta?.total ?? 0}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
};
