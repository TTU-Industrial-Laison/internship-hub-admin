"use client";

import { MoreHorizontal, Eye, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Type Definition matching API response
type InternshipPeriod = {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: "ONGOING" | "UPCOMING" | "COMPLETED";
  eligibleCategories: string[];
};

// Dummy Data matching new API shape
const DUMMY_DATA: InternshipPeriod[] = [
  {
    id: "1",
    name: "Industrial Attachment 2024",
    startDate: "2024-06-01T00:00:00.000Z",
    endDate: "2024-08-31T00:00:00.000Z",
    status: "ONGOING",
    eligibleCategories: ["BTECH", "HND"],
  },
  {
    id: "2",
    name: "Long Vacation Internship 2024",
    startDate: "2024-06-15T00:00:00.000Z",
    endDate: "2024-08-15T00:00:00.000Z",
    status: "UPCOMING",
    eligibleCategories: ["HND"],
  },
  {
    id: "3",
    name: "Industrial Attachment 2023",
    startDate: "2023-06-01T00:00:00.000Z",
    endDate: "2023-08-31T00:00:00.000Z",
    status: "COMPLETED",
    eligibleCategories: ["BTECH", "HND"],
  },
  {
    id: "4",
    name: "Short Internship (Level 200)",
    startDate: "2024-05-20T00:00:00.000Z",
    endDate: "2024-07-20T00:00:00.000Z",
    status: "ONGOING",
    eligibleCategories: ["BTECH"],
  },
  {
    id: "5",
    name: "Teaching Practice 2024",
    startDate: "2024-09-10T00:00:00.000Z",
    endDate: "2024-12-10T00:00:00.000Z",
    status: "UPCOMING",
    eligibleCategories: ["BTECH", "HND"],
  },
];

// Formats ISO string to e.g. "2nd April 2024"
const formatDate = (isoString: string): string => {
  return format(new Date(isoString), "do MMMM yyyy");
};

export function InternshipList({ events }: { events?: InternshipPeriod[] }) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const data = events ?? DUMMY_DATA;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200";
      case "UPCOMING":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200";
      case "COMPLETED":
        return "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full border border-slate-300 rounded-lg overflow-hidden shadow-card bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 h-12">
            <TableHead className="font-semibold text-slate-600">
              Period Name
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Start Date
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              End Date
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Eligible Categories
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Status
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((period) => (
              <TableRow
                key={period.id}
                className="hover:bg-slate-50/50 transition-colors h-14"
              >
                <TableCell className="font-medium text-slate-900">
                  {period.name}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(period.startDate)}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(period.endDate)}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {period.eligibleCategories.map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="text-xs font-medium bg-violet-50 text-violet-700 border-violet-200 shadow-none"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    className={cn(
                      "font-medium shadow-none",
                      getStatusColor(period.status)
                    )}
                    variant="outline"
                  >
                    {period.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <DropdownMenu
                    open={openMenuId === period.id}
                    onOpenChange={(open) =>
                      setOpenMenuId(open ? period.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Eye className="h-4 w-4 text-slate-500" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Edit className="h-4 w-4 text-slate-500" />
                        Edit Period
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-700 cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="h-14">
              <TableCell colSpan={6} className="text-center font-semibold">
                No internship periods found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
