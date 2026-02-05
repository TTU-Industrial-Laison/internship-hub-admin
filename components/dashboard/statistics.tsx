import React from "react";
import { GraduationCap, Users, CheckCircle, Clock } from "lucide-react";

export function DashboardStats() {
  const stats = [
    {
      title: "Total Students",
      value: "1,247",
      subtitle: "+12% from last period",
      subtitleColor: "text-green-600",
      icon: GraduationCap,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Supervisors",
      value: "84",
      subtitleParts: [
        { text: "72 Active", color: "text-green-600" },
        { text: " • ", color: "text-gray-400" },
        { text: "12 Pending", color: "text-gray-500" },
      ],
      icon: Users,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Completed Supervisions",
      value: "892",
      subtitle: "71.5% completion rate",
      subtitleColor: "text-gray-500",
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Supervisions",
      value: "355",
      subtitle: "Requires attention",
      subtitleColor: "text-orange-600",
      icon: Clock,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center w-full p-4 gap-3 bg-white rounded-lg border border-gray-300 shadow-card hover:shadow transition-shadow"
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
                <p className={`${stat.subtitleColor} font-medium`}>
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
