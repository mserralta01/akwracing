"use client";

import { useState, useEffect } from "react";
import { Course, CourseLevel } from "@/types/course";
import { courseService } from "@/lib/services/course-service";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, ArrowUpDown } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | "all">("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await courseService.getCourses({});
      setCourses(result.courses);
    } catch (error) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date TBD';
      }
      return date.toLocaleDateString();
    } catch (error) {
      return 'Date TBD';
    }
  };

  const filteredAndSortedCourses = courses
    .filter(course => selectedLevel === "all" || course.level === selectedLevel)
    .sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Available Courses</h1>
        <p className="text-muted-foreground">
          Browse our selection of professional racing courses
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Select
          value={selectedLevel}
          onValueChange={(value: CourseLevel | "all") => setSelectedLevel(value)}
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

        <Button
          variant="outline"
          onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
          className="w-[180px]"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Sort by Date
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

