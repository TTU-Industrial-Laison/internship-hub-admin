"use client";

import { GraduationCap, Users, CheckCircle, Clock } from "lucide-react";
import { useGetSupervisionOverallStats } from "@/lib/hooks/queries/use-supervision-queries";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { useAppSelector } from "@/lib/store/hooks";
import { selectSelectedPeriodId } from "@/lib/store/slices/dashboard-slice";

interface DashboardStatsProps {
  internshipPeriodId?: string;
}

export function DashboardStats({
  internshipPeriodId: propPeriodId,
}: DashboardStatsProps) {
  const reduxSelectedPeriodId = useAppSelector(selectSelectedPeriodId);
  const internshipPeriodId =
    propPeriodId !== undefined ? propPeriodId : reduxSelectedPeriodId;

  const { data: statsData, isLoading } =
    useGetSupervisionOverallStats(internshipPeriodId);

  const getGrowthColor = (growth?: string) => {
    if (!growth) return "text-gray-500";
    if (growth.startsWith("+")) return "text-green-600";
    if (growth.startsWith("-")) return "text-red-600";
    return "text-gray-500";
  };

  const getCompletionColor = (rate?: number) => {
    if (rate === undefined) return "text-gray-500";
    if (rate >= 80) return "text-green-600";
    if (rate >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const stats = [
    {
      title: "Total Students",
      value: statsData?.students.total.toLocaleString() ?? "0",
      subtitle: statsData?.students.growth ?? "0% from last period",
      subtitleColor: getGrowthColor(statsData?.students.growth),
      icon: GraduationCap,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Supervisors",
      value: statsData?.supervisors.total.toString() ?? "0",
      subtitleParts: [
        {
          text: `${statsData?.supervisors.active ?? 0} Active`,
          color: "text-green-600",
        },
        { text: " • ", color: "text-gray-400" },
        {
          text: `${statsData?.supervisors.pending ?? 0} Pending`,
          color: "text-gray-500",
        },
      ],
      icon: Users,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Completed Supervisions",
      value: statsData?.supervision.completed.toLocaleString() ?? "0",
      subtitle: statsData?.supervision.completionRate ?? "0% completion rate",
      subtitleColor: getCompletionColor(
        statsData?.supervision.rawCompletionRate,
      ),
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Supervisions",
      value: statsData?.supervision.pending.toLocaleString() ?? "0",
      subtitle: "Requires attention",
      subtitleColor: "text-orange-600",
      icon: Clock,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  if (isLoading) {
    return <SkeletonLoader type="stats-card" count={4} />;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center w-full p-4 gap-3 bg-white rounded-lg border border-gray-300 shadow-card transition-shadow"
        >
          <div
            className={`p-2 rounded-full flex items-center justify-center ${stat.iconBg}`}
          >
            <stat.icon
              className={`w-5 h-5 ${stat.iconColor}`}
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
            <div className="text-xs mt-0.5">
              {stat.subtitleParts ? (
                <p>
                  {stat.subtitleParts.map((part, i) => (
                    <span
                      key={`${part.text}-${i}`}
                      className={`${part.color} font-medium`}
                    >
                      {part.text}
                    </span>
                  ))}
                </p>
              ) : (
                <p
                  className={`${
                    stat.subtitleColor || "text-gray-500"
                  } font-medium`}
                >
                  {stat.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
