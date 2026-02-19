"use client";

import React, { useState } from "react";
import { OverallProgress } from "@/components/dashboard/overall-progress";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentSupervisionLogs } from "@/components/dashboard/recent-logs";
import { DashboardStats } from "@/components/dashboard/statistics";
import { SupervisionProgress } from "@/components/dashboard/supervision-progress";
import { PeriodSelector } from "@/components/dashboard/period-selector";

export default function DashboardPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold mb-2">Overview</h1>
        <PeriodSelector
          value={selectedPeriodId}
          onValueChange={setSelectedPeriodId}
        />
      </div>
      <DashboardStats internshipPeriodId={selectedPeriodId} />
      <div className="flex gap-5">
        <SupervisionProgress internshipPeriodId={selectedPeriodId} />
        <QuickActions />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <OverallProgress />
        <RecentSupervisionLogs />
      </div>
    </div>
  );
}
