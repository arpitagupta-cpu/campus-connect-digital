import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: number;
  user: {
    name: string;
    initials: string;
    online: boolean;
  };
  action: string;
  subject: string;
  subjectColor?: string;
  timestamp: string;
}

export function RecentActivities() {
  // This would typically come from an API, but for now we'll use some static data
  const activities: Activity[] = [
    {
      id: 1,
      user: {
        name: "John Smith",
        initials: "JS",
        online: true,
      },
      action: "submitted an assignment for",
      subject: "Database Systems",
      subjectColor: "text-primary",
      timestamp: "5 minutes ago",
    },
    {
      id: 2,
      user: {
        name: "Alice Johnson",
        initials: "AJ",
        online: true,
      },
      action: "viewed the resources for",
      subject: "Network Security",
      subjectColor: "text-primary",
      timestamp: "12 minutes ago",
    },
    {
      id: 3,
      user: {
        name: "Robert Brown",
        initials: "RB",
        online: false,
      },
      action: "missed assignment deadline for",
      subject: "AI & ML",
      subjectColor: "text-destructive",
      timestamp: "1 hour ago",
    },
    {
      id: 4,
      user: {
        name: "Emma Taylor",
        initials: "ET",
        online: true,
      },
      action: "requested clarification on",
      subject: "Database assignment",
      subjectColor: "text-primary",
      timestamp: "3 hours ago",
    },
  ];

  // Mock query for loading state demonstration
  const { isLoading } = useQuery({
    queryKey: ["/api/activities"],
    queryFn: async () => {
      // In a real app, we would fetch activities from the API
      return activities;
    },
    enabled: false, // Disable the query since we're using static data
  });

  return (
    <Card>
      <CardHeader className="border-b p-6">
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="ml-3 space-y-1 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex">
                <div className="flex-shrink-0 relative">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {activity.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                      activity.user.online ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    {activity.action}{" "}
                    <span className={activity.subjectColor || ""}>
                      {activity.subject}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 border-t text-center">
        <Button variant="link" className="mx-auto">
          View All Activities
        </Button>
      </CardFooter>
    </Card>
  );
}
