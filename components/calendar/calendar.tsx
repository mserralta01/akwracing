"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Clock, MapPin } from "lucide-react";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  instructor: string;
};

type CalendarProps = {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
};

export function Calendar({ events, currentDate, onEventClick }: CalendarProps) {
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    setDays(daysInMonth);
  }, [currentDate]);

  const getEventsForDay = (day: Date) => {
    return events.filter((event) =>
      isWithinInterval(day, { start: event.start, end: event.end })
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[120px] bg-white p-2",
                !isSameMonth(day, currentDate) && "text-gray-400 bg-gray-50",
                "relative group hover:bg-gray-50 transition-colors"
              )}
            >
              <span className="text-sm font-medium">{format(day, "d")}</span>
              <div className="space-y-1 mt-1">
                {dayEvents.map((event) => (
                  <HoverCard key={event.id}>
                    <HoverCardTrigger asChild>
                      <div
                        className={cn(
                          "text-xs p-2 rounded cursor-pointer",
                          "bg-blue-500 text-white",
                          "hover:bg-blue-600 transition-colors"
                        )}
                        onClick={() => onEventClick?.(event)}
                      >
                        {event.title}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="mr-1 h-3 w-3" />
                          {format(event.start, "h:mm a")} -{" "}
                          {format(event.end, "h:mm a")}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="mr-1 h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 