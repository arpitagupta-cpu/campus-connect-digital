import { ReactNode, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import Chatbox from "./chatbox";

interface MainLayoutProps {
  children: ReactNode;
  userType: "student" | "admin";
}

export default function MainLayout({ children, userType }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showChatbox, setShowChatbox] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        userType={userType}
      />
      
      <div className="flex pt-16 h-screen">
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          userType={userType} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>

      <Chatbox 
        showChatbox={showChatbox} 
        setShowChatbox={setShowChatbox} 
        userType={userType}
      />
    </div>
  );
}
