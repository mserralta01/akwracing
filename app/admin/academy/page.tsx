"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseService } from "@/lib/services/course-service";
import { Course } from "@/types/course";
import {
  GraduationCap,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface AcademyStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  upcomingCourses: number;
}

export default function AcademyPage() {
  const [stats, setStats] = useState<AcademyStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    upcomingCourses: 0,
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademyData = async () => {
      try {
        const { courses } = await courseService.getCourses({});
        
        // Calculate stats
        const now = new Date();
        const activeCourses = courses.filter(
          (course) => 
            new Date(course.startDate) <= now && 
            new Date(course.endDate) >= now
        );
        const upcomingCourses = courses.filter(
          (course) => new Date(course.startDate) > now
        );

        setStats({
          totalCourses: courses.length,
          activeCourses: activeCourses.length,
          totalStudents: 0, // This would come from a students service
          upcomingCourses: upcomingCourses.length,
        });

        // Get recent courses
        const sortedCourses = [...courses].sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setRecentCourses(sortedCourses.slice(0, 5));
      } catch (error) {
        console.error("Error fetching academy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademyData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Courses</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingCourses}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(course.startDate).toLocaleDateString()} -{" "}
                    {new Date(course.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium">{course.availableSpots}</span>{" "}
                    spots left
                  </div>
                  <div className="text-sm font-medium">${course.price}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 