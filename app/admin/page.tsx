"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseService } from "@/lib/services/course-service";
import { Course } from "@/types/course";
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  upcomingCourses: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    upcomingCourses: 0,
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const coursesResult = await courseService.getCourses(
          undefined,
          "startDate",
          5
        );
        
        const now = new Date();
        const activeCourses = coursesResult.courses.filter(
          (course) =>
            new Date(course.startDate) <= now && new Date(course.endDate) >= now
        );
        
        const upcomingCourses = coursesResult.courses.filter(
          (course) => new Date(course.startDate) > now
        );

        setStats({
          totalCourses: coursesResult.courses.length,
          activeCourses: activeCourses.length,
          totalStudents: 0, // This would come from a separate students collection
          upcomingCourses: upcomingCourses.length,
        });

        setRecentCourses(coursesResult.courses);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
            <BookOpen className="h-4 w-4 text-muted-foreground" />
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
