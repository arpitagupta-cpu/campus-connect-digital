import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface ChatboxProps {
  showChatbox: boolean;
  setShowChatbox: (show: boolean) => void;
  userType: "student" | "admin";
}

interface Message {
  sender: "user" | "support";
  text: string;
  time: string;
}

export default function Chatbox({ showChatbox, setShowChatbox, userType }: ChatboxProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "support",
      text: "Hi there! 👋 How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newMessage: Message = {
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    
    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        sender: "support",
        text: userType === "student"
          ? "Thanks for your message! I'll help you with that. Please allow some time for our team to process your request."
          : "Got it! Is there anything else you need assistance with regarding the admin panel?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name?.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase() || '';
  };

  return (
    <>
      {/* Chat Button */}
      {!showChatbox && (
        <Button
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setShowChatbox(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Box */}
      {showChatbox && (
        <div className="fixed bottom-6 right-6 z-50 w-80 rounded-xl bg-card shadow-xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback className="bg-primary-foreground text-primary">CS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Campus Support</h3>
                <div className="flex items-center text-xs">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowChatbox(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className="p-4 h-80 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-start",
                  msg.sender === "user" && "justify-end"
                )}
              >
                {msg.sender === "support" && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-primary text-primary-foreground">CS</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  "p-3 rounded-lg max-w-[85%]",
                  msg.sender === "support" ? "bg-muted rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"
                )}>
                  <p className="text-sm">{msg.text}</p>
                  <span className={cn(
                    "text-xs mt-1 block",
                    msg.sender === "support" ? "text-muted-foreground" : "text-primary-foreground/70"
                  )}>
                    {msg.time}
                  </span>
                </div>
                
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarFallback className="bg-muted text-foreground">
                      {user && getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-background rounded-r-none"
              />
              <Button 
                className="rounded-l-none" 
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
