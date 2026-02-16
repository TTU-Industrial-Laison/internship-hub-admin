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
import { cn, formatDate, getStatusColor } from "@/lib/utils";
import { InternshipPeriod } from "@/types/api/internship-period";




interface InternshipListProps {
  events: InternshipPeriod[];
}

export function InternshipList({ events }: InternshipListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const data = events;

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

                <TableCell>{formatDate(period.startDate)}</TableCell>

                <TableCell>{formatDate(period.endDate)}</TableCell>

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
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 focus-visible:ring-1"
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
