"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { courseService } from "@/lib/services/course-service";
import { Course } from "@/types/course";
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Clock,
  Award,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  upcomingCourses: number;
  totalRevenue: number;
  activeStudents: number;
  completionRate: number;
  averageRating: number;
  totalEquipmentSales: number;
  equipmentStock: number;
}

interface Event {
  title: string;
  date: Date;
  type: 'course' | 'competition' | 'training';
}

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6B7280"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    upcomingCourses: 0,
    totalRevenue: 0,
    activeStudents: 0,
    completionRate: 0,
    averageRating: 0,
    totalEquipmentSales: 0,
    equipmentStock: 0,
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [studentDistribution, setStudentDistribution] = useState<any[]>([]);
  const [equipmentData, setEquipmentData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { courses } = await courseService.getCourses({});
        
        const now = new Date();
        const activeCourses = courses.filter(
          (course) =>
            new Date(course.startDate) <= now && new Date(course.endDate) >= now
        );
        
        const upcomingCourses = courses.filter(
          (course) => new Date(course.startDate) > now
        );

        // Mock data for demonstration
        setStats({
          totalCourses: courses.length,
          activeCourses: activeCourses.length,
          totalStudents: 150,
          upcomingCourses: upcomingCourses.length,
          totalRevenue: 75000,
          activeStudents: 85,
          completionRate: 92,
          averageRating: 4.8,
          totalEquipmentSales: 25000,
          equipmentStock: 45,
        });

        setRecentCourses(courses.slice(0, 5));

        // Mock revenue data
        setRevenueData([
          { month: 'Jan', revenue: 12000, equipmentSales: 3000 },
          { month: 'Feb', revenue: 15000, equipmentSales: 4500 },
          { month: 'Mar', revenue: 18000, equipmentSales: 5000 },
          { month: 'Apr', revenue: 16000, equipmentSales: 4000 },
          { month: 'May', revenue: 21000, equipmentSales: 6000 },
          { month: 'Jun', revenue: 19000, equipmentSales: 5500 },
        ]);

        // Mock student distribution data
        setStudentDistribution([
          { name: 'Beginner', value: 45 },
          { name: 'Intermediate', value: 35 },
          { name: 'Advanced', value: 20 },
        ]);

        // Mock equipment data
        setEquipmentData([
          { category: 'Racing Karts', stock: 15, sales: 8 },
          { category: 'Safety Gear', stock: 25, sales: 12 },
          { category: 'Parts', stock: 150, sales: 45 },
          { category: 'Accessories', stock: 80, sales: 30 },
        ]);

        // Mock upcoming events
        setUpcomingEvents([
          { title: 'Karting Championship', date: new Date('2024-03-15'), type: 'competition' },
          { title: 'Advanced Course Start', date: new Date('2024-03-20'), type: 'course' },
          { title: 'Pro Training Session', date: new Date('2024-03-25'), type: 'training' },
        ]);

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
          {[...Array(8)].map((_, i) => (
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
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined academy & equipment sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEquipmentSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total equipment revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Stock</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.equipmentStock}</div>
            <p className="text-xs text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Course and equipment revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Course Revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="equipmentSales"
                    name="Equipment Sales"
                    stroke="#6366F1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Overview</CardTitle>
            <CardDescription>Stock and sales by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipmentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{item.category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.stock} in stock
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {item.sales} sold this month
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses and Upcoming Events */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Latest racing courses</CardDescription>
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

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Schedule for the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {event.type === 'competition' && (
                      <Award className="h-4 w-4 text-yellow-500" />
                    )}
                    {event.type === 'course' && (
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                    )}
                    {event.type === 'training' && (
                      <Clock className="h-4 w-4 text-green-500" />
                    )}
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
