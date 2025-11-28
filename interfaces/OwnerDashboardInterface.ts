export interface OwnerDashboard {
    success: boolean;
    message: string;
    data: {
        totalProperties: number;
        rentedProperties: number;
        pendingApplications: number;
        scheduledMaintenances: number;
        recentApplications: {
            id: string;
            applicantName: string;
            propertyTitle: string;
            status: string;
            applicationDate: string;
        }[];
    };
}