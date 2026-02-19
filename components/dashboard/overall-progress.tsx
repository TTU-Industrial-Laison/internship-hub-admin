"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGetSupervisionPieChart } from "@/lib/hooks/queries/use-supervision-queries";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { SupervisionPieChartData } from "@/types/api/supervision";

interface OverallProgressProps {
  internshipPeriodId?: string;
}

export const OverallProgress = ({
  internshipPeriodId,
}: OverallProgressProps) => {
  const { data: chartData, isLoading } =
    useGetSupervisionPieChart(internshipPeriodId);

  return (
    <section className="p-4 h-96 bg-white rounded-lg border border-gray-300 shadow-card transition-shadow">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Overall Progress</h3>
      </div>

      <div className="h-[280px] w-full mt-4">
        {isLoading ? (
          <SkeletonLoader type="pie-chart" />
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="label"
              >
                {chartData.map(
                  (entry: SupervisionPieChartData, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ),
                )}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-sm">No progress data available</p>
          </div>
        )}
      </div>
    </section>
  );
};
