"use client";

import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/auth/admin-guard";
import { studentService } from "@/lib/services/student-service";
import { DateRange } from "@/types/course";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format, eachDayOfInterval, startOfDay } from "date-fns";

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6B7280"];

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"daily" | "status">("daily");

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    try {
      setLoading(true);
      const allEnrollments = await studentService.getAllEnrollments();
      
      // Filter enrollments by date range
      const filtered = allEnrollments.filter((enrollment) => {
        const enrollmentDate = enrollment.createdAt ? new Date(enrollment.createdAt) : null;
        return (
          enrollmentDate !== null &&
          (!date.from || enrollmentDate >= date.from) &&
          (!date.to || enrollmentDate <= date.to)
        );
      });

      setEnrollments(filtered);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDailyRevenueData = () => {
    if (!date.from || !date.to) return [];

    const days = eachDayOfInterval({ start: date.from, end: date.to });
    return days.map((day) => {
      const dayEnrollments = enrollments.filter(
        (e) => startOfDay(new Date(e.createdAt)).getTime() === day.getTime()
      );
      
      return {
        date: format(day, "MMM dd"),
        revenue: dayEnrollments.reduce(
          (sum, e) => 
            e.paymentDetails.paymentStatus === "completed" 
              ? sum + e.paymentDetails.amount 
              : sum,
          0
        ),
        enrollments: dayEnrollments.length,
      };
    });
  };

  const getPaymentStatusData = () => {
    const statusCounts = enrollments.reduce((acc, enrollment) => {
      const status = enrollment.paymentDetails.paymentStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  };

  const getTotalRevenue = () => {
    return enrollments
      .filter((e) => e.paymentDetails.paymentStatus === "completed")
      .reduce((sum, e) => sum + e.paymentDetails.amount, 0);
  };

  const getSuccessRate = () => {
    const completed = enrollments.filter(
      (e) => e.paymentDetails.paymentStatus === "completed"
    ).length;
    return enrollments.length ? (completed / enrollments.length) * 100 : 0;
  };

  const getAverageOrderValue = () => {
    const completedEnrollments = enrollments.filter(
      (e) => e.paymentDetails.paymentStatus === "completed"
    );
    return completedEnrollments.length
      ? getTotalRevenue() / completedEnrollments.length
      : 0;
  };

  return (
    <AdminGuard>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            View enrollment and payment analytics
          </p>
        </div>

        <div className="grid gap-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>During selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${getTotalRevenue().toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
                <CardDescription>Completed payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {getSuccessRate().toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
                <CardDescription>Per completed enrollment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${getAverageOrderValue().toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment Analytics</CardTitle>
                  <CardDescription>
                    View revenue and enrollment trends
                  </CardDescription>
                </div>
                <div className="flex gap-4">
                  <DateRangePicker
                    value={date}
                    onChange={(newDate) => {
                      setDate(newDate || { from: undefined });
                    }}
                  />
                  <Select value={viewType} onValueChange={(v: "daily" | "status") => setViewType(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Revenue</SelectItem>
                      <SelectItem value="status">Payment Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  Loading...
                </div>
              ) : viewType === "daily" ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getDailyRevenueData()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        name="Revenue ($)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="enrollments"
                        stroke="#6366F1"
                        name="Enrollments"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPaymentStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPaymentStatusData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
} 