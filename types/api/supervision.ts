export interface SupervisionOverallStats {
    internshipPeriodId: string;
    periodName: string;
    students: {
        total: number;
        growth: string;
    };
    supervisors: {
        total: number;
        active: number;
        pending: number;
        display: string;
    };
    supervision: {
        completed: number;
        pending: number;
        completionRate: string;
        rawCompletionRate: number;
    };
}

export interface SupervisionProgressData {
    label: string;
    count: number;
}

export interface SupervisionPieChartData {
    label: string;
    value: number;
    color: string;
}
