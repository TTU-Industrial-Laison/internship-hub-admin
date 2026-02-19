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
