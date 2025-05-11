import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

interface ProfileCardProps {
  className?: string;
}

export function ProfileCard({ className }: ProfileCardProps) {
  const { user } = useAuth();

  // Extract initials from full name
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Student image and details */}
          <div className="flex items-center mb-4 md:mb-0 md:mr-8">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                {user && getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user?.fullName}</h2>
              <p className="text-sm text-muted-foreground">
                {user?.department}, Year {user?.year}
              </p>
              <p className="text-sm">ID: {user?.studentId}</p>
            </div>
          </div>
          
          {/* Class info */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Section</p>
              <p className="font-medium">{user?.section || "CSE-301"}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Attendance</p>
              <p className="font-medium">92%</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Semester</p>
              <p className="font-medium">{user?.semester || "Fall 2023"}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">CGPA</p>
              <p className="font-medium">{user?.cgpa || "3.8/4.0"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
