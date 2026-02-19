import { useQuery } from "@tanstack/react-query";
import { supervisionApi } from "@/lib/api/queries/supervision";
import { Query_Keys } from "@/lib/constants/query-keys";

export const useGetSupervisionOverallStats = (internshipPeriodId?: string) => {
    return useQuery({
        queryKey: Query_Keys.supervision.overallStats(internshipPeriodId),
        queryFn: () => supervisionApi.getOverallStats(internshipPeriodId),
        enabled: !!internshipPeriodId || internshipPeriodId === undefined, // Fetch even if undefined (backend might handle it) but usually we want at least a placeholder or default
    });
};

export const useGetSupervisionProgressChart = (params: {
    internshipPeriodId?: string;
    interval: "weekly" | "monthly";
}) => {
    return useQuery({
        queryKey: [
            ...Query_Keys.supervision.overallStats(params.internshipPeriodId),
            "progress-chart",
            params.interval,
        ],
        queryFn: () => supervisionApi.getProgressChart(params),
        enabled: !!params.internshipPeriodId || params.internshipPeriodId === undefined,
    });
};

export const useGetSupervisionPieChart = (internshipPeriodId?: string) => {
    return useQuery({
        queryKey: [
            ...Query_Keys.supervision.overallStats(internshipPeriodId),
            "pie-chart",
        ],
        queryFn: () => supervisionApi.getPieChart(internshipPeriodId),
        enabled: !!internshipPeriodId || internshipPeriodId === undefined,
    });
};
