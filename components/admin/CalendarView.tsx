import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  start?: Date;
  end?: Date;
  type: 'task' | 'project' | 'meeting' | 'deadline';
  priority: 'low' | 'medium' | 'high';
  projectId?: string;
  clientId?: string;
  description?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  view?: 'month' | 'week' | 'day';
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick, onDateClick, view }) => {
  const { t } = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calendar logic for different views
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = event.start ? new Date(event.start) : new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const today = new Date();

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center font-medium text-muted-foreground border-b">
            {day}
          </div>
        ))}
        
        {/* Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === today.toDateString();
          const isSelected = selectedDate?.toDateString() === day.toDateString();

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-border cursor-pointer transition-all hover:bg-muted/50 ${
                !isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''
              } ${isToday ? 'bg-accent/10 border-accent' : ''} ${
                isSelected ? 'bg-accent/20' : ''
              }`}
              onClick={() => {
                setSelectedDate(day);
                onDateClick(day);
              }}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-accent' : ''}`}>
                {day.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate cursor-pointer transition-transform hover:scale-105 ${
                      event.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                      event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    // Week view implementation
    return (
      <div className="text-center p-8 text-muted-foreground">
        Week view - Implementation needed
      </div>
    );
  };

  const renderDayView = () => {
    // Day view implementation
    return (
      <div className="text-center p-8 text-muted-foreground">
        Day view - Implementation needed
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-foreground">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <div className="flex space-x-1">
            <button
              onClick={() => navigateCalendar('prev')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Poprzedni miesiąc"
              title="Poprzedni miesiąc"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateCalendar('next')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Następny miesiąc"
              title="Następny miesiąc"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  view === v ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500/20 rounded"></div>
          <span>High Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500/20 rounded"></div>
          <span>Medium Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500/20 rounded"></div>
          <span>Low Priority</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;