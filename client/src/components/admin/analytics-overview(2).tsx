import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsOverview() {
  // This would typically come from API endpoints
  const { isLoading } = useQuery({
    queryKey: ["/api/analytics"],
    queryFn: async () => {
      // In a real app, this would fetch analytics data from the server
      return null;
    },
    enabled: false, // Disable the query since we're using placeholder UI
  });

  return (
    <Card>
      <CardHeader className="border-b p-6">
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-36 w-36 rounded-full mx-auto" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assignment Submission Rate */}
            <div>
              <h3 className="text-sm font-medium mb-4">Assignment Submission Rate</h3>
              <div className="flex justify-center">
                <div className="relative h-36 w-36">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      className="stroke-muted"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="75 25"
                      strokeDashoffset="0"
                      className="text-primary -rotate-90 transform origin-center"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold">75%</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 text-sm">
                <p>Average submission rate across all classes</p>
              </div>
            </div>
            
            {/* Student Engagement */}
            <div>
              <h3 className="text-sm font-medium mb-4">Student Engagement</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Database Systems</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Network Security</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>AI & Machine Learning</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Software Engineering</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </div>
            
            {/* Resource Utilization */}
            <div>
              <h3 className="text-sm font-medium mb-4">Resource Utilization</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2" />
                  <span className="text-sm">Lecture Notes - 45%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent-light dark:bg-accent-dark mr-2" />
                  <span className="text-sm">Textbook PDFs - 28%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm">Tutorial Videos - 15%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
                  <span className="text-sm">Practice Exercises - 12%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 border-t text-center">
        <Button variant="link" className="mx-auto">
          View Detailed Analytics
        </Button>
      </CardFooter>
    </Card>
  );
}
