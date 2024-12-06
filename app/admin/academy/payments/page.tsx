"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Enrollment, StudentProfile } from "@/types/student";
import { Course } from "@/types/course";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type EnrollmentWithDetails = Enrollment & {
  studentDetails?: StudentProfile;
  courseDetails?: Course;
};

export default function PaymentsPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [status, setStatus] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<Enrollment | null>(null);

  // Get unique courses and students for filters
  const uniqueCourses = useMemo(() => {
    const courseMap = new Map();
    enrollments.forEach(e => {
      if (e.courseDetails) {
        courseMap.set(e.courseId, e.courseDetails);
      }
    });
    return Array.from(courseMap.values())
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [enrollments]);

  const uniqueStudents = useMemo(() => {
    const studentMap = new Map();
    enrollments.forEach(e => {
      if (e.studentDetails) {
        studentMap.set(e.studentId, e.studentDetails);
      }
    });
    return Array.from(studentMap.values())
      .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  }, [enrollments]);

  const loadEnrollmentDetails = async (enrollment: Enrollment): Promise<EnrollmentWithDetails> => {
    try {
      const [student, course] = await Promise.all([
        studentService.getStudent(enrollment.studentId),
        studentService.getCourse(enrollment.courseId)
      ]);

      return {
        ...enrollment,
        studentDetails: student || undefined,
        courseDetails: course || undefined
      };
    } catch (error) {
      console.error("Error loading enrollment details:", error);
      return enrollment;
    }
  };

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const allEnrollments = await studentService.getAllEnrollments();
      
      // Update any pending payments older than 24 hours to failed
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const updatedEnrollments = await Promise.all(
        allEnrollments.map(async (enrollment) => {
          const enrollmentDate = new Date(enrollment.createdAt);
          if (
            enrollment.paymentDetails.paymentStatus === "pending" &&
            enrollmentDate < twentyFourHoursAgo
          ) {
            try {
              await studentService.updateEnrollment(enrollment.id, {
                status: "payment_failed",
                paymentDetails: {
                  ...enrollment.paymentDetails,
                  paymentStatus: "failed",
                  errorMessage: "Payment timeout - no response received"
                },
              });
              return {
                ...enrollment,
                status: "payment_failed" as const,
                paymentDetails: {
                  ...enrollment.paymentDetails,
                  paymentStatus: "failed" as const,
                  errorMessage: "Payment timeout - no response received"
                },
              };
            } catch (error) {
              console.error("Error updating enrollment:", error);
              return enrollment;
            }
          }
          return enrollment;
        })
      );

      const filtered = updatedEnrollments.filter((enrollment): enrollment is Enrollment => {
        if (!enrollment) return false;
        
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
            enrollment.paymentDetails.paymentStatus === "failed") ||
          (status === "refunded" &&
            enrollment.paymentDetails.paymentStatus === "refunded");
        return inDateRange && matchesStatus;
      });

      // Load student and course details for each enrollment
      const enrollmentsWithDetails = await Promise.all(
        filtered.map(loadEnrollmentDetails)
      );

      // Apply course and student filters
      const filteredByDetails = enrollmentsWithDetails.filter((enrollment) => {
        const matchesCourse = selectedCourse === "all" || enrollment.courseId === selectedCourse;
        const matchesStudent = selectedStudent === "all" || enrollment.studentId === selectedStudent;
        return matchesCourse && matchesStudent;
      });

      setEnrollments(filteredByDetails);
    } catch (error) {
      console.error("Error loading enrollments:", error);
      toast({
        title: "Error",
        description: "Failed to load enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

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
        toast({
          title: "Success",
          description: "Payment has been refunded",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to process refund",
          variant: "destructive",
        });
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error processing refund:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteClick = (enrollment: Enrollment) => {
    setEnrollmentToDelete(enrollment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!enrollmentToDelete) return;

    try {
      setProcessing(enrollmentToDelete.id);
      await studentService.deleteEnrollment(enrollmentToDelete.id);
      await loadEnrollments();
      toast({
        title: "Success",
        description: "Failed payment record has been deleted",
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting enrollment:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment record",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
      setDeleteDialogOpen(false);
      setEnrollmentToDelete(null);
    }
  };

  return (
    <AdminGuard>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Failed Payment Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this failed payment record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {uniqueCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[200px]">
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      {uniqueStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="refunded">Refunded</SelectItem>
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
                      <TableHead>Course Start Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : enrollments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            {new Date(enrollment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {enrollment.studentDetails ? (
                              `${enrollment.studentDetails.firstName} ${enrollment.studentDetails.lastName}`
                            ) : (
                              <span className="text-muted-foreground">Loading...</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {enrollment.courseDetails ? (
                              enrollment.courseDetails.title
                            ) : (
                              <span className="text-muted-foreground">Loading...</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {enrollment.courseDetails ? (
                              new Date(enrollment.courseDetails.startDate).toLocaleDateString()
                            ) : (
                              <span className="text-muted-foreground">Loading...</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                enrollment.paymentDetails.paymentStatus === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : enrollment.paymentDetails.paymentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : enrollment.paymentDetails.paymentStatus === "refunded"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {enrollment.paymentDetails.paymentStatus}
                              {enrollment.paymentDetails.errorMessage && (
                                <span className="ml-1 text-xs text-red-600">
                                  ({enrollment.paymentDetails.errorMessage})
                                </span>
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            {enrollment.paymentDetails.transactionId || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            ${enrollment.paymentDetails.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {enrollment.paymentDetails.paymentStatus === "completed" && (
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
                              {enrollment.paymentDetails.paymentStatus === "failed" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(enrollment)}
                                  disabled={processing === enrollment.id}
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
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