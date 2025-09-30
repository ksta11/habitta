export interface OwnerDashboard {
    success: boolean;
    message: string;
    data: {
        totalProperties: number;
        pendingApplications: number;
        scheduledMaintenances: number;
        monthlyIncome: {
            month: string;
            amount: number;
        }[];
        recentApplications: {
            id: string;
            applicantName: string;
            propertyTitle: string;
            status: string;
            applicationDate: string;
        }[];
    };
}