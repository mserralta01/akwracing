"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Course, CourseLevel } from "@/types/course";
import { instructorService } from "@/lib/services/instructor-service";
import { courseService } from "@/lib/services/course-service";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Filter = {
  level?: CourseLevel | "all";
  location?: string;
  instructorId?: string;
};

type InstructorInfo = {
  id: string;
  name: string;
};

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructorNames, setInstructorNames] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filter>({
    level: "all",
    location: "all",
    instructorId: "all",
  });

  useEffect(() => {
    fetchCourses();
  }, [date]);

  useEffect(() => {
    fetchInstructorNames();
  }, [courses]);

  const fetchInstructorNames = async () => {
    try {
      const instructorIds = Array.from(new Set(courses.map(c => c.instructorId)));
      const { instructors } = await instructorService.getInstructors();
      
      const namesMap = new Map<string, string>();
      instructors.forEach(instructor => {
        if (instructorIds.includes(instructor.id)) {
          namesMap.set(instructor.id, instructor.name);
        }
      });
      
      setInstructorNames(namesMap);
    } catch (error) {
      console.error("Failed to fetch instructor names:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await courseService.getCourses({});
      setCourses(result.courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique locations and instructors from courses
  const locations = Array.from(new Set(courses.map(c => c.location)));
  const instructors: InstructorInfo[] = Array.from(
    new Set(courses.map(c => c.instructorId))
  ).map(id => ({
    id,
    name: instructorNames.get(id) || 'Unknown Instructor'
  }));

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-500 text-white hover:bg-emerald-600";
      case "Intermediate":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "Advanced":
        return "bg-racing-red text-white hover:bg-red-600";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const filteredCourses = courses.filter(course => {
    const courseDate = new Date(course.startDate);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    // First filter by date range
    if (courseDate < monthStart || courseDate > monthEnd) return false;
    
    // Then apply user filters
    if (filters.level !== "all" && course.level !== filters.level) return false;
    if (filters.location !== "all" && course.location !== filters.location) return false;
    if (filters.instructorId !== "all" && course.instructorId !== filters.instructorId) return false;
    
    return true;
  });

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Course Calendar</h1>
        <p className="text-muted-foreground">
          View and filter upcoming racing courses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={filters.level}
                  onValueChange={(value: CourseLevel | "all") => 
                    setFilters(prev => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.location}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.instructorId}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, instructorId: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Instructors</SelectItem>
                    {instructors.map(instructor => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDate(subMonths(date, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {format(date, "MMMM yyyy")}
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDate(addMonths(date, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setDate(new Date())}
                >
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="bg-background p-2 text-center text-sm font-medium"
                  >
                    {day}
                  </div>
                ))}
                {eachDayOfInterval({
                  start: startOfMonth(date),
                  end: endOfMonth(date),
                }).map((day) => {
                  const daysCourses = filteredCourses.filter(course => 
                    isSameDay(new Date(course.startDate), day)
                  );

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[120px] bg-background p-2",
                        !isSameMonth(day, date) && "text-muted-foreground",
                        "relative group hover:bg-muted/50 transition-colors"
                      )}
                    >
                      <span className="text-sm font-medium">{format(day, "d")}</span>
                      <div className="space-y-1 mt-1">
                        {daysCourses.map((course) => (
                          <HoverCard key={course.id}>
                            <HoverCardTrigger asChild>
                              <div
                                className={cn(
                                  "text-xs p-2 rounded cursor-pointer",
                                  getLevelColor(course.level as CourseLevel)
                                )}
                                onClick={() => window.location.href = `/courses/${course.id}`}
                              >
                                {course.title}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold">{course.title}</h4>
                                <p className="text-sm">{course.shortDescription}</p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {format(new Date(course.startDate), "h:mm a")}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Location: {course.location}
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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border shadow-sm"
                classNames={{
                  months: "space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  ),
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-8 w-8 p-0 font-normal",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 