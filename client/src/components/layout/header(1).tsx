import { useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userType: "student" | "admin";
}

export default function Header({ sidebarOpen, setSidebarOpen, userType }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [notificationCount] = useState(3);

  // Extract initials from full name
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-card fixed top-0 w-full z-10 shadow-sm border-b">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo & Menu Button */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="mr-4 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href={userType === "admin" ? "/admin" : "/"} className="text-xl font-bold">
            <span className="text-primary">Campus</span>
            <span className="text-accent-light dark:text-accent-dark">Connect</span>
          </Link>
        </div>
        
        {/* Right Nav Items */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:flex relative rounded-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] lg:w-[300px] h-9"
            />
          </div>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" className="h-auto text-xs">
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b bg-red-50 dark:bg-red-900/10">
                  <div className="flex gap-3 items-start">
                    <Badge variant="destructive" className="mt-0.5 shrink-0">
                      Urgent
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">Lab cancelled - Oct 12</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The Database Systems lab scheduled for Oct 12 has been cancelled.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex gap-3 items-start">
                    <Badge variant="secondary" className="mt-0.5 shrink-0">
                      General
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">Holiday announcement - Oct 24</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The campus will be closed on Oct 24 for the national holiday.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex gap-3 items-start">
                    <Badge variant="default" className="mt-0.5 shrink-0">
                      Assignment
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">New assignment posted</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Network Security Protocol Analysis due Oct 18
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full h-10 text-sm" asChild>
                <div>View all notifications</div>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1.5" aria-label="User menu">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user && getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium">{user?.fullName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user?.username}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
