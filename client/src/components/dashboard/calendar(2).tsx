import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Event } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface CalendarDay {
  date: number;
  currentMonth: boolean;
  hasEvent?: boolean;
  eventType?: string;
}

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const getPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const getNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const calendar: CalendarDay[] = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      calendar.push({
        date: daysInPrevMonth - firstDay + i + 1,
        currentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      
      // Check if there's an event on this date
      const dateEvents = events?.filter(event => 
        new Date(event.date).toDateString() === date.toDateString()
      );
      
      const hasEvent = dateEvents && dateEvents.length > 0;
      let eventType = hasEvent ? dateEvents[0].category.toLowerCase() : undefined;
      
      calendar.push({
        date: i,
        currentMonth: true,
        hasEvent,
        eventType,
      });
    }
    
    // Calculate how many days from next month to add (to fill 6 rows)
    const remainingDays = 42 - calendar.length;
    
    // Next month days
    for (let i = 1; i <= remainingDays; i++) {
      calendar.push({
        date: i,
        currentMonth: false,
      });
    }
    
    return calendar;
  };

  const calendar = generateCalendar();
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  
  const getEventClass = (eventType?: string) => {
    if (!eventType) return '';
    
    switch(eventType) {
      case 'assignment':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'exam':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'holiday':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className="border-b p-6">
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium">{monthName} {currentYear}</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={getPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={getNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
            <div key={index} className="text-xs font-medium text-center text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendar.map((day, index) => (
            <div 
              key={index} 
              className={`h-9 flex items-center justify-center text-sm ${
                day.currentMonth ? 'text-foreground' : 'text-muted-foreground/40'
              } ${day.hasEvent ? `${getEventClass(day.eventType)} rounded-full` : ''}`}
            >
              {day.date}
              {day.hasEvent && !getEventClass(day.eventType) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full bg-primary"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Calendar Legend */}
        <div className="mt-4 text-xs space-y-2">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-blue-100 dark:bg-blue-900/20 mr-2"></span>
            <span>Assignment Due</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mr-2"></span>
            <span>Exam</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-red-100 dark:bg-red-900/20 mr-2"></span>
            <span>Cancelled Class</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-900/20 mr-2"></span>
            <span>Holiday</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
