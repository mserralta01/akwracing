"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Course } from "@/types/course";
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
import { useRouter } from "next/navigation";

type Filter = {
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
    location: "all",
    instructorId: "all",
  });

  const router = useRouter();

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
  const locations = Array.from(
    new Set(courses.map(c => c.location))
  ).filter(location => location && typeof location === 'string' && location.trim() !== '');
  
  const instructors: InstructorInfo[] = Array.from(
    new Set(courses.map(c => c.instructorId).filter((id): id is string => 
      id !== undefined && id !== null && id.trim() !== ''
    ))
  ).map(id => ({
    id,
    name: instructorNames.get(id) || 'Unknown Instructor'
  }));

  const filteredCourses = courses.filter(course => {
    try {
      if (!course.startDate) return false;
      
      const courseDate = new Date(course.startDate);
      if (isNaN(courseDate.getTime())) return false;
      
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      // First filter by date range
      if (courseDate < monthStart || courseDate > monthEnd) return false;
      
      // Then apply user filters
      if (filters.location !== "all" && course.location !== filters.location) return false;
      if (filters.instructorId !== "all" && course.instructorId !== filters.instructorId) return false;
      
      return true;
    } catch (error) {
      console.error("Error filtering course:", error, course);
      return false;
    }
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-white to-gray-50">
      {/* Racing-inspired background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #000 0px,
            #000 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>

      <div className="container relative z-10 mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Racing Academy <span className="text-racing-red">Course Schedule</span>
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Plan your path to racing excellence with our comprehensive course calendar. 
            From beginner basics to advanced techniques, find the perfect time to start your journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="space-y-4 border-b border-gray-100 pb-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger className="w-[180px] bg-white">
                      <MapPin className="w-4 h-4 mr-2 text-racing-red" />
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location || 'unknown'}>
                          {location || 'Unknown Location'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.instructorId}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, instructorId: value }))}
                  >
                    <SelectTrigger className="w-[180px] bg-white">
                      <Filter className="w-4 h-4 mr-2 text-racing-red" />
                      <SelectValue placeholder="Filter by instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Instructors</SelectItem>
                      {instructors.map(instructor => (
                        <SelectItem key={instructor.id} value={instructor.id || 'unknown'}>
                          {instructor.name || 'Unknown Instructor'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDate(subMonths(date, 1))}
                      className="hover:text-racing-red"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {format(date, "MMMM yyyy")}
                    </h2>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDate(addMonths(date, 1))}
                      className="hover:text-racing-red"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setDate(new Date())}
                    className="hover:text-racing-red"
                  >
                    Today
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className="bg-gray-50/80 p-2 text-center text-sm font-semibold text-gray-600"
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
                          "min-h-[120px] bg-white p-2",
                          !isSameMonth(day, date) && "text-gray-400 bg-gray-50/50",
                          "relative group hover:bg-gray-50 transition-colors"
                        )}
                      >
                        <span className="text-sm font-medium">{format(day, "d")}</span>
                        <div className="space-y-1 mt-1">
                          {daysCourses.map((course) => (
                            <HoverCard key={course.id}>
                              <HoverCardTrigger asChild>
                                <div
                                  className={cn(
                                    "text-xs p-2 rounded cursor-pointer shadow-sm transition-all duration-200",
                                    "hover:scale-[1.02] hover:shadow-md"
                                  )}
                                  onClick={() => router.push(`/courses/${course.id}`)}
                                >
                                  {course.title}
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80 p-4 shadow-xl">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold">{course.title}</h4>
                                  <p className="text-sm text-gray-600">{course.description}</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {course.startDate ? (() => {
                                      try {
                                        const date = new Date(course.startDate);
                                        return !isNaN(date.getTime()) 
                                          ? format(date, "h:mm a") 
                                          : "Time not available";
                                      } catch (e) {
                                        return "Time not available";
                                      }
                                    })() : "Time not available"}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {course.location}
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
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-semibold text-gray-900",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:text-racing-red"
                    ),
                    nav_button_previous: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:text-racing-red",
                    nav_button_next: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:text-racing-red",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    day: cn(
                      "h-8 w-8 p-0 font-normal hover:bg-gray-100 hover:text-racing-red transition-colors",
                      "aria-selected:bg-racing-red aria-selected:text-white aria-selected:hover:bg-racing-red aria-selected:hover:text-white"
                    ),
                    day_selected: "bg-racing-red text-white hover:bg-racing-red hover:text-white",
                    day_today: "bg-gray-100 text-gray-900 font-semibold",
                    day_outside: "text-gray-400",
                    day_disabled: "text-gray-300",
                    day_hidden: "invisible",
                    day_range_start: "bg-racing-red text-white",
                    day_range_end: "bg-racing-red text-white",
                    day_range_middle: "bg-gray-100",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 