"use client";

import { useGetSupervisionActivities } from "@/lib/hooks/queries/use-supervision-queries";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { formatDistanceToNow } from "date-fns";
import { Check, UserPlus, Map, FileText, LucideIcon } from "lucide-react";

interface RecentActivityProps {
  internshipPeriodId?: string;
}

const ACTION_CONFIG: Record<
  string,
  { icon: LucideIcon; title: string; color: string; bgColor: string }
> = {
  VISIT_RECORDED: {
    icon: Check,
    title: "Supervision completed",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  SUPERVISOR_INVITED: {
    icon: UserPlus,
    title: "New supervisor added",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  PERIOD_UPDATED: {
    icon: Map,
    title: "Internship period updated",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  STUDENT_REGISTERED: {
    icon: FileText,
    title: "Student registered",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  // Default fallback
  DEFAULT: {
    icon: FileText,
    title: "Activity recorded",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
};

export const RecentSupervisionLogs = () => {
  const { data: activities, isLoading } = useGetSupervisionActivities(10);

  return (
    <section className="p-6 h-96 bg-white rounded-lg border border-gray-300 shadow-card transition-shadow overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#1F2937]">Recent Activity</h3>
        <button className="text-sm font-semibold text-[#4F46E5] hover:underline">
          View all
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
        {isLoading ? (
          <SkeletonLoader type="activity-list" count={4} />
        ) : activities && activities.length > 0 ? (
          activities.map((activity) => {
            const config =
              ACTION_CONFIG[activity.action] || ACTION_CONFIG.DEFAULT;
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex gap-4 items-start group">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${config.bgColor}`}
                >
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-semibold text-[#1F2937] leading-tight mb-0.5">
                    {config.title}
                  </h4>
                  <p className="text-[14px] text-[#6B7280] leading-snug truncate">
                    {activity.details}
                  </p>
                  <p className="text-[13px] text-[#9CA3AF] mt-1 italic">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <p className="text-sm">No recent activity recorded</p>
          </div>
        )}
      </div>
    </section>
  );
};
