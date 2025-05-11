import MainLayout from "@/components/layout/main-layout";
import { UploadContent } from "@/components/admin/upload-content";
import { RecentActivities } from "@/components/admin/recent-activities";
import { AnalyticsOverview } from "@/components/admin/analytics-overview";
import { StudentManagement } from "@/components/admin/student-management";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, FileText, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <MainLayout userType="admin">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </MainLayout>
    );
  }

  // Sample stats data for admin dashboard
  const stats = [
    {
      title: "Total Students",
      count: 245,
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
      trend: "+12% increase",
      trendDetails: "from last semester",
    },
    {
      title: "Assignments",
      count: 18,
      icon: <FileText className="h-5 w-5" />,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
      trend: "12 active, 6 past",
    },
    {
      title: "Resources",
      count: 74,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-green-500 bg-green-100 dark:bg-green-900/30",
      trend: "+8 new",
      trendDetails: "this week",
    },
    {
      title: "Notices",
      count: 9,
      icon: <Bell className="h-5 w-5" />,
      color: "text-red-500 bg-red-100 dark:bg-red-900/30",
      trend: "3 urgent",
      trendType: "alert",
    },
  ];

  return (
    <MainLayout userType="admin">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                  <p className="text-2xl font-semibold">{stat.count}</p>
                </div>
                <div className={`h-10 w-10 rounded-full ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center">
                {stat.trendType === "alert" ? (
                  <span className="text-xs text-destructive flex items-center">
                    <Bell className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </span>
                ) : stat.trend.startsWith("+") ? (
                  <span className="text-xs text-green-500 flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    {stat.trend}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {stat.trend}
                  </span>
                )}
                {stat.trendDetails && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {stat.trendDetails}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Student Management */}
      <div className="mt-6">
        <StudentManagement />
      </div>
      
      {/* Admin Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <UploadContent />
        <RecentActivities />
      </div>
      
      {/* Admin Analytics */}
      <div className="mt-6">
        <AnalyticsOverview />
      </div>
    </MainLayout>
  );
}
