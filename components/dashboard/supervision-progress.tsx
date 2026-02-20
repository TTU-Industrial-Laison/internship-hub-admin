"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetSupervisionProgressChart } from "@/lib/hooks/queries/use-supervision-queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { useAppSelector } from "@/lib/store/hooks";
import { selectSelectedPeriodId } from "@/lib/store/slices/dashboard-slice";

interface SupervisionProgressProps {
  internshipPeriodId?: string;
}

export const SupervisionProgress = ({
  internshipPeriodId: propPeriodId,
}: SupervisionProgressProps) => {
  const reduxSelectedPeriodId = useAppSelector(selectSelectedPeriodId);
  const internshipPeriodId =
    propPeriodId !== undefined ? propPeriodId : reduxSelectedPeriodId;
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly");

  const { data: chartData, isLoading } = useGetSupervisionProgressChart({
    internshipPeriodId,
    interval: timeRange,
  });

  return (
    <section className="flex-1 p-4 h-96 bg-white rounded-lg border border-gray-300 shadow-card transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Supervision Progress</h3>
        {/* Toggle */}
        <div className="relative inline-flex border border-gray-400/60 shadow-card rounded-full">
          <Button
            onClick={() => setTimeRange("weekly")}
            variant={timeRange === "weekly" ? "default" : "link"}
            size="sm"
            className={`w-20 hover:no-underline text-black h-8 rounded-l-2xl rounded-r-none p-0 transition-all duration-200 ease-in-out ${
              timeRange === "weekly" && "text-white"
            }`}
          >
            Weekly
          </Button>

          <Button
            onClick={() => setTimeRange("monthly")}
            variant={timeRange === "monthly" ? "default" : "link"}
            size="sm"
            className={`w-20 h-8 hover:no-underline text-black rounded-r-2xl rounded-l-none p-0 transition-all duration-200 ease-in-out ${
              timeRange === "monthly" && "text-white"
            }`}
          >
            Monthly
          </Button>
        </div>
      </div>

      <div className="h-[280px] w-full">
        {isLoading ? (
          <SkeletonLoader type="progress-chart" count={6} />
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === chartData.length - 1 ? "#0D9488" : "#2DD4BF"
                    } // Highlight last bar
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <p className="text-sm">No data available for this period</p>
          </div>
        )}
      </div>
    </section>
  );
};
