"use client";

import { SearchInput } from "@/components/common/search-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fragment } from "react/jsx-runtime";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { INTERNSHIP_STATUS_OPTIONS } from "@/lib/constants/internship-period";
import { PaginationTabs } from "../common/pagination";
import { InternshipList } from "./internship-list";

export const InternshipPeriod = () => {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">Internship Periods</h3>
      <div className="my-4 flex justify-between items-center gap-4">
        <div className="w-1/2">
          <SearchInput
            defaultValue={""}
            value={""}
            onChange={() => {}}
            onSearch={() => {}}
            placeholder="Search by period name"
            // disabled={isLoading}
            // isLoading={isFetching}
          />
        </div>

        <div className="flex items-center gap-4">
          <div>
            <Select value={""} onValueChange={() => {}} disabled={false}>
              <SelectTrigger className="rounded-full border border-gray-400 shadow-none min-w-[140px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {INTERNSHIP_STATUS_OPTIONS.map((option, index) => (
                    <Fragment key={option.value}>
                      <SelectItem value={option.value}>
                        {option.label}
                      </SelectItem>
                      {index < INTERNSHIP_STATUS_OPTIONS.length - 1 && (
                        <Separator />
                      )}
                    </Fragment>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button size="sm" className="rounded-full text-sm">
              <Plus strokeWidth={2.5} /> Add Period
            </Button>
          </div>
        </div>
      </div>
      <InternshipList />
      <PaginationTabs page={1} size={10} total={10} onPageChange={() => {}} />
    </section>
  );
};
