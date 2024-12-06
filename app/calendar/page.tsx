"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { courseService } from "@/lib/services/course-service";
import { instructorService } from "@/lib/services/instructor-service";
import { Calendar } from "@/components/calendar/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMonths, subMonths } from "date-fns";

type InstructorInfo = {
  id: string;
  name: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  instructor: string;
};

export default function CalendarPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const result = await courseService.getCourses();
      setCourses(result.courses);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value === "all" ? null : value);
  };

  const handleInstructorChange = (value: string) => {
    setSelectedInstructor(value === "all" ? null : value);
  };

  const events: CalendarEvent[] = courses
    .filter((course) => {
      const matchesLocation = !selectedLocation || course.location === selectedLocation;
      const matchesInstructor = !selectedInstructor || course.instructorId === selectedInstructor;
      return matchesLocation && matchesInstructor;
    })
    .map((course) => ({
      id: course.id,
      title: course.title,
      start: new Date(course.startDate),
      end: new Date(course.endDate),
      location: course.location,
      instructor: course.instructorId || "",
    }));

  // Extract unique locations and instructors from courses
  const locations = Array.from(new Set(courses.map(c => c.location)));
  const instructors = Array.from(
    new Set(courses.filter(c => c.instructorId).map(c => c.instructorId))
  ).map(id => ({
    id: id!,
    name: "Instructor " + id // You should fetch actual instructor names
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Course Calendar</h1>
        <p className="text-muted-foreground">View and manage course schedules</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button onClick={handlePreviousMonth} variant="outline">
            Previous Month
          </Button>
          <Button onClick={handleNextMonth} variant="outline">
            Next Month
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedLocation || "all"} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedInstructor || "all"} onValueChange={handleInstructorChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by instructor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Instructors</SelectItem>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Calendar
        events={events}
        currentDate={currentDate}
        onEventClick={(event) => {
          console.log("Event clicked:", event);
        }}
      />
    </div>
  );
} 