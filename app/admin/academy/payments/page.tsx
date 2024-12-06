"use client";

import { useState } from "react";
import { AdminGuard } from "@/components/auth/admin-guard";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "@/types/course";
import { studentService } from "@/lib/services/student-service";
import { paymentService } from "@/lib/services/payment-service";
import { Enrollment } from "@/types/student";

export default function PaymentsPage() {
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [status, setStatus] = useState<string>("all");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const allEnrollments = await studentService.getAllEnrollments();
      const filtered = allEnrollments.filter((enrollment: Enrollment) => {
        const enrollmentDate = new Date(enrollment.createdAt);
        const inDateRange =
          (!date.from || enrollmentDate >= date.from) &&
          (!date.to || enrollmentDate <= date.to);
        const matchesStatus =
          status === "all" ||
          (status === "completed" &&
            enrollment.paymentDetails.paymentStatus === "completed") ||
          (status === "pending" &&
            enrollment.paymentDetails.paymentStatus === "pending") ||
          (status === "failed" &&
            enrollment.paymentDetails.paymentStatus === "failed");
        return inDateRange && matchesStatus;
      });
      setEnrollments(filtered);
    } catch (error) {
      console.error("Error loading enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (enrollment: Enrollment) => {
    if (!enrollment.paymentDetails.transactionId) return;
    
    try {
      setProcessing(enrollment.id);
      const result = await paymentService.refundPayment(
        enrollment.paymentDetails.transactionId,
        enrollment.paymentDetails.amount
      );

      if (result.success) {
        await studentService.updateEnrollment(enrollment.id, {
          status: "cancelled",
          paymentDetails: {
            ...enrollment.paymentDetails,
            paymentStatus: "refunded",
          },
        });
        await loadEnrollments();
      }
    } catch (error) {
      console.error("Error processing refund:", error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <AdminGuard>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">
            Manage course payments and process refunds
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
              <CardDescription>Overview of payment statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </div>
                  <div className="text-2xl font-bold">
                    $
                    {enrollments
                      .filter(
                        (e) => e.paymentDetails.paymentStatus === "completed"
                      )
                      .reduce((sum, e) => sum + e.paymentDetails.amount, 0)
                      .toFixed(2)}
                  </div>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="text-sm font-medium text-muted-foreground">
                    Successful Payments
                  </div>
                  <div className="text-2xl font-bold">
                    {
                      enrollments.filter(
                        (e) => e.paymentDetails.paymentStatus === "completed"
                      ).length
                    }
                  </div>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="text-sm font-medium text-muted-foreground">
                    Failed Payments
                  </div>
                  <div className="text-2xl font-bold">
                    {
                      enrollments.filter(
                        (e) => e.paymentDetails.paymentStatus === "failed"
                      ).length
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View and manage payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <DatePickerWithRange 
                    date={date} 
                    setDate={(newDate) => {
                      if (newDate) {
                        setDate(newDate);
                      }
                    }} 
                  />
                </div>
                <div className="w-[200px]">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={loadEnrollments}>Apply Filters</Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : enrollments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            {new Date(enrollment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{enrollment.studentId}</TableCell>
                          <TableCell>{enrollment.courseId}</TableCell>
                          <TableCell>
                            ${enrollment.paymentDetails.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                enrollment.paymentDetails.paymentStatus ===
                                "completed"
                                  ? "bg-green-100 text-green-800"
                                  : enrollment.paymentDetails.paymentStatus ===
                                    "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {enrollment.paymentDetails.paymentStatus}
                            </span>
                          </TableCell>
                          <TableCell>
                            {enrollment.paymentDetails.transactionId || "N/A"}
                          </TableCell>
                          <TableCell>
                            {enrollment.paymentDetails.paymentStatus ===
                              "completed" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRefund(enrollment)}
                                disabled={processing === enrollment.id}
                              >
                                {processing === enrollment.id
                                  ? "Processing..."
                                  : "Refund"}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
} 