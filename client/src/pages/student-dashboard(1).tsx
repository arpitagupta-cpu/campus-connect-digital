import MainLayout from "@/components/layout/main-layout";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AssignmentFeed } from "@/components/dashboard/assignment-feed";
import { Calendar } from "@/components/dashboard/calendar";
import { ResourcesList } from "@/components/dashboard/resources-list";
import { Timetable } from "@/components/dashboard/timetable";
import { TodoList } from "@/components/dashboard/todo-list";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <MainLayout userType="student">
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Skeleton className="h-36 col-span-1 md:col-span-2" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout userType="student">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Profile Card */}
        <ProfileCard className="col-span-1 md:col-span-2" />
        
        {/* Quick Stats */}
        <StatsCard type="assignments" />
        <StatsCard type="exams" />
        <StatsCard type="notices" />
      </div>
      
      {/* Assignment Feed and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <AssignmentFeed />
        <Calendar />
      </div>
      
      {/* Resources, Timetable, and Todo List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <ResourcesList />
        <Timetable />
        <TodoList />
      </div>
    </MainLayout>
  );
}
