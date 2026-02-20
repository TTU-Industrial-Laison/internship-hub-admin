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

export interface SupervisionActivity {
    id: string;
    actorId: string | null;
    action: string;
    entityType: string;
    entityId: string | null;
    details: string;
    metadata: Record<string, any>;
    createdAt: string;
    actor: {
        id: string;
        firstName: string;
        lastName: string;
        role: "ADMIN" | "SUPERVISOR" | "STUDENT";
    } | null;
}
