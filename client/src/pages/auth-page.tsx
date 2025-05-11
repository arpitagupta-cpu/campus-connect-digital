import { AuthForm } from "@/components/auth/auth-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-screen-lg grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Auth Form */}
        <div className="flex flex-col justify-center">
          <AuthForm />
          
          {/* Theme Toggle */}
          <div className="mt-6 text-center">
            <ThemeToggle variant="outline" />
          </div>
        </div>
        
        {/* Hero Section */}
        <Card className="hidden md:flex flex-col overflow-hidden border-none shadow-xl">
          <div className="flex-1 bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">Welcome to CampusConnect</h1>
              <p className="text-lg text-primary-foreground/90 mb-6">
                Your personal academic hub for accessing course materials, assignments, schedules, and more.
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-full mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" y2="13" x2="8"/>
                      <line x1="16" y1="17" y2="17" x2="8"/>
                      <line x1="10" y1="9" y2="9" x2="8"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Personalized Dashboard</h3>
                    <p className="text-sm text-primary-foreground/80">
                      Access your assignments, resources, and schedule all in one place
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-full mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" y2="6" x2="16"/>
                      <line x1="8" y1="2" y2="6" x2="8"/>
                      <line x1="3" y1="10" y2="10" x2="21"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Integrated Calendar</h3>
                    <p className="text-sm text-primary-foreground/80">
                      Keep track of deadlines, exams, and important events
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-full mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Instant Support</h3>
                    <p className="text-sm text-primary-foreground/80">
                      Get help and communicate with faculty through the integrated chat
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-primary-foreground/70 text-sm mt-8">
              © 2023 CampusConnect. All rights reserved.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
