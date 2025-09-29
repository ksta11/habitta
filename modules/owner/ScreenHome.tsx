import React from 'react';
import { View, ScrollView } from 'react-native';
import { DashboardHeader } from "../../modules/owner/dashboard/dashboard-header"
import { StatsGrid } from "../../modules/owner/dashboard/stats-grid"
import { RevenueChart } from "../../modules/owner/dashboard/revenue-chart"
import { RecentApplications } from "../../modules/owner/dashboard/recent-applications"
import { CurrentPlan } from "../../modules/owner/dashboard/current-plan"
import { QuickActions } from "../../modules/owner/dashboard/quick-actions"

export default function Dashboard() {
  return (
    <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
            <View className="px-4 py-6">
                <DashboardHeader />
                <View className="mt-6">
                    <StatsGrid />
                </View>
                <View>
                    <View className="mt-6">
                        <RevenueChart />
                    </View>
                    <View className="mt-6">
                        <RecentApplications />
                    </View>
                    <View className="mt-6">
                        <QuickActions />
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
  )
}