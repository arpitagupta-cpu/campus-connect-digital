import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Calendar, FileText, BookOpen, 
  Medal, Clock, Users, HelpCircle, Upload, 
  Bell, MessageSquare, BarChart 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface SidebarProps {
  sidebarOpen: boolean;
  userType: "student" | "admin";
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar({ sidebarOpen, userType }: SidebarProps) {
  const [location] = useLocation();

  const studentNavItems: { category: string; items: NavItem[] }[] = [
    {
      category: "Main",
      items: [
        {
          title: "Dashboard",
          href: "/",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          title: "Calendar",
          href: "/calendar",
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: "Assignments",
          href: "/assignments",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Resources",
          href: "/resources",
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          title: "Results",
          href: "/results",
          icon: <Medal className="h-5 w-5" />,
        },
      ],
    },
    {
      category: "Others",
      items: [
        {
          title: "Timetable",
          href: "/timetable",
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: "Section Info",
          href: "/section",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Help & Support",
          href: "/help",
          icon: <HelpCircle className="h-5 w-5" />,
        },
      ],
    },
  ];

  const adminNavItems: { category: string; items: NavItem[] }[] = [
    {
      category: "Admin",
      items: [
        {
          title: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          title: "Students",
          href: "/admin/students",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Assignments",
          href: "/admin/assignments",
          icon: <Upload className="h-5 w-5" />,
        },
        {
          title: "Results",
          href: "/admin/results",
          icon: <Medal className="h-5 w-5" />,
        },
      ],
    },
    {
      category: "Communication",
      items: [
        {
          title: "Notices",
          href: "/admin/notices",
          icon: <Bell className="h-5 w-5" />,
        },
        {
          title: "Messages",
          href: "/admin/messages",
          icon: <MessageSquare className="h-5 w-5" />,
        },
        {
          title: "Analytics",
          href: "/admin/analytics",
          icon: <BarChart className="h-5 w-5" />,
        },
      ],
    },
  ];

  const navItems = userType === "student" ? studentNavItems : adminNavItems;

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-10 w-64 bg-card border-r pt-16 lg:pt-0 transform transition-transform duration-200 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <ScrollArea className="h-full">
        <div className="p-4">
          {navItems.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className={cn("mb-6", categoryIndex > 0 && "pt-2 border-t")}
            >
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {category.category}
              </h3>

              <nav className="space-y-1">
                {category.items.map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.href}
                  >
                    <a className={cn(
                      "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg",
                      location === item.href 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-muted transition-colors"
                    )}>
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* System Status Card */}
          <div className="p-4 bg-muted rounded-lg mt-6">
            <div className="text-sm font-medium mb-2">System Status</div>
            <div className="flex items-center">
              <Progress value={98} className="h-2 flex-1" />
              <span className="text-xs ml-2">98%</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              All systems operational
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
