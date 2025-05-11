import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Schedule } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function Timetable() {
  const { data: scheduleData, isLoading } = useQuery<Schedule[]>({
    queryKey: ["/api/schedule"],
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  
  // Format date for display
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "border-blue-500";
      case "cancelled":
        return "border-red-500";
      default:
        return "border-gray-300 dark:border-gray-700";
    }
  };

  return (
    <Card>
      <CardHeader className="border-b p-6">
        <CardTitle>Timetable</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs defaultValue="today">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Weekly Schedule</h3>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="today" className="space-y-3">
            <div className="font-mono text-xs text-muted-foreground mb-2">
              {currentDate}
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="h-4 w-[180px]" />
                      <div className="flex items-center justify-between mt-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : scheduleData ? (
              <div className="space-y-3">
                {scheduleData
                  .filter(item => item.day === today)
                  .map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg bg-muted border-l-4 ${getStatusColor(item.status)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium">{item.course}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.courseCode} • {item.type}
                          </p>
                        </div>
                        {item.status.toLowerCase() === "cancelled" && (
                          <Badge variant="destructive">Cancelled</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{item.startTime} - {item.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{item.room}, {item.building}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {scheduleData.filter(item => item.day === today).length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No classes scheduled for today.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Unable to load schedule data.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="week">
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day} className="space-y-2">
                  <h4 className="font-medium text-sm">{day}</h4>
                  
                  {scheduleData && scheduleData.filter(item => item.day === day).length > 0 ? (
                    <div className="space-y-2">
                      {scheduleData
                        .filter(item => item.day === day)
                        .map((item, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded-md bg-muted border-l-4 ${getStatusColor(item.status)} text-xs`}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">{item.course}</span>
                              <span>{item.startTime} - {item.endTime}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground">
                      No classes
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="p-4 border-t text-center">
        <Button variant="link" className="mx-auto">
          View Full Timetable
        </Button>
      </CardFooter>
    </Card>
  );
}
