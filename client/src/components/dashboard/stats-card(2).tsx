import { Card, CardContent } from "@/components/ui/card";
import { FileText, CalendarClock, Bell } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  type: "assignments" | "exams" | "notices";
  className?: string;
}

export function StatsCard({ type, className }: StatsCardProps) {
  // Sample data
  const stats = {
    assignments: {
      title: "Assignments",
      count: 5,
      icon: <FileText className="h-5 w-5" />,
      completed: 3,
      progress: 60,
      details: "3 completed, 2 pending",
    },
    exams: {
      title: "Upcoming Exams",
      count: 2,
      icon: <CalendarClock className="h-5 w-5" />,
      items: [
        { name: "Database Systems", date: "Oct 15" },
        { name: "Network Security", date: "Oct 18" },
      ],
    },
    notices: {
      title: "New Notices",
      count: 3,
      icon: <Bell className="h-5 w-5" />,
      items: [
        { text: "Lab cancelled - Oct 12", type: "urgent" },
        { text: "Holiday announcement - Oct 24", type: "info" },
      ],
    },
  };

  const data = stats[type];
  const colors = {
    assignments: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    exams: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    notices: "text-red-500 bg-red-100 dark:bg-red-900/30",
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{data.title}</h3>
            <p className="text-2xl font-semibold">{data.count}</p>
          </div>
          <div className={`h-10 w-10 rounded-full ${colors[type]} flex items-center justify-center`}>
            {data.icon}
          </div>
        </div>

        {type === "assignments" && (
          <>
            <div className="flex items-center">
              <Progress value={data.progress} className="h-2 flex-1" />
              <span className="text-xs ml-2">{data.completed}/{data.count}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {data.details}
            </p>
          </>
        )}

        {type === "exams" && (
          <div>
            {data.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm mt-2">
                <span>{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
            ))}
          </div>
        )}

        {type === "notices" && (
          <div className="space-y-2">
            {data.items.map((item, index) => (
              <Badge
                key={index}
                variant={item.type === "urgent" ? "destructive" : "secondary"}
                className="flex items-center w-full justify-start font-normal py-1 h-auto"
              >
                {item.type === "urgent" && (
                  <Bell className="h-3 w-3 mr-1" />
                )}
                <span>{item.text}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
