import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Upload, Eye } from "lucide-react";
import { Assignment } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function AssignmentFeed() {
  const { data: assignments, isLoading, refetch } = useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
  });

  const getBadgeVariant = (dueDate: Date, status: string) => {
    if (status === "submitted") return "success";
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return "destructive";
    if (daysUntilDue <= 3) return "destructive";
    if (daysUntilDue <= 7) return "warning";
    return "secondary";
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b p-6">
        <CardTitle>Assignment Feed</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="divide-y">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6">
                <div className="flex items-start">
                  <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-8 w-[120px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : assignments && assignments.length > 0 ? (
          <div className="divide-y">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course} ({assignment.courseCode})
                        </p>
                      </div>
                      <Badge variant={getBadgeVariant(assignment.dueDate, assignment.status)}>
                        {assignment.status === "submitted" ? (
                          "Submitted"
                        ) : (
                          `Due ${formatDate(assignment.dueDate)}`
                        )}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          <span>Download</span>
                        </Button>
                        {assignment.status === "submitted" ? (
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            <span>View Submission</span>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Upload className="h-3.5 w-3.5 mr-1" />
                            <span>Submit</span>
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Posted on {formatDate(assignment.postedDate)}
                        {assignment.status === "submitted" && " • Submitted Oct 8"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No assignments found</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 border-t text-center">
        <Button variant="link" className="mx-auto">
          View All Assignments
        </Button>
      </CardFooter>
    </Card>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
