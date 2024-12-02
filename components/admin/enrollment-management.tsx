"use client";

import { useState, useEffect } from "react";
import { studentService } from "@/lib/services/student-service";
import { paymentService } from "@/lib/services/payment-service";
import { Enrollment, StudentProfile, ParentProfile } from "@/types/student";
import { Course } from "@/types/course";
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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

type EnrollmentWithDetails = Enrollment & {
  student?: StudentProfile;
  parent?: ParentProfile;
  course?: Course;
};

export function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [status, setStatus] = useState<string>("all");

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const allEnrollments = await studentService.getAllEnrollments();
      
      // Load details for each enrollment
      const detailedEnrollments = await Promise.all(
        allEnrollments.map(async (enrollment) => {
          const [student, parent, course] = await Promise.all([
            studentService.getStudent(enrollment.studentId),
            studentService.getParent(enrollment.parentId),
            studentService.getCourse(enrollment.courseId),
          ]);
          return {
            ...enrollment,
            student,
            parent,
            course,
          };
        })
      );

      // Filter enrollments based on date and status
      const filtered = detailedEnrollments.filter((enrollment) => {
        const enrollmentDate = new Date(enrollment.createdAt);
        const inDateRange =
          (!date.from || enrollmentDate >= date.from) &&
          (!date.to || enrollmentDate <= date.to);
        const matchesStatus =
          status === "all" || enrollment.status === status;
        return inDateRange && matchesStatus;
      });

      setEnrollments(filtered);
    } catch (error) {
      console.error("Error loading enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, [date, status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800";
      case "payment_failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Management</CardTitle>
          <CardDescription>View and manage course enrollments</CardDescription>
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending_registration">Pending Registration</SelectItem>
                  <SelectItem value="pending_payment">Pending Payment</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No enrollments found
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        {format(new Date(enrollment.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {enrollment.student ? (
                          <div>
                            <div className="font-medium">
                              {enrollment.student.firstName} {enrollment.student.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Parent: {enrollment.parent?.firstName} {enrollment.parent?.lastName}
                            </div>
                          </div>
                        ) : (
                          "Loading..."
                        )}
                      </TableCell>
                      <TableCell>
                        {enrollment.course ? (
                          <div>
                            <div className="font-medium">{enrollment.course.title}</div>
                            <div className="text-sm text-muted-foreground">
                              ${enrollment.paymentDetails.amount}
                            </div>
                          </div>
                        ) : (
                          "Loading..."
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(enrollment.status)}
                          variant="secondary"
                        >
                          {enrollment.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPaymentStatusColor(enrollment.paymentDetails.paymentStatus)}
                          variant="secondary"
                        >
                          {enrollment.paymentDetails.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedEnrollment(enrollment)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Enrollment Details</DialogTitle>
                              <DialogDescription>
                                Complete enrollment information and history
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px] mt-4">
                              <div className="space-y-6">
                                {/* Student Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Student Information</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <dl className="grid grid-cols-2 gap-4">
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                                        <dd>
                                          {enrollment.student?.firstName} {enrollment.student?.lastName}
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                                        <dd>{enrollment.student?.dateOfBirth}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Emergency Contact</dt>
                                        <dd>
                                          {enrollment.student?.emergencyContact.name} ({enrollment.student?.emergencyContact.relationship})
                                          <br />
                                          {enrollment.student?.emergencyContact.phone}
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Experience Level</dt>
                                        <dd>{enrollment.student?.experience?.skillLevel || "N/A"}</dd>
                                      </div>
                                    </dl>
                                  </CardContent>
                                </Card>

                                {/* Parent Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Parent Information</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <dl className="grid grid-cols-2 gap-4">
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                                        <dd>
                                          {enrollment.parent?.firstName} {enrollment.parent?.lastName}
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Contact</dt>
                                        <dd>
                                          {enrollment.parent?.email}
                                          <br />
                                          {enrollment.parent?.phone}
                                        </dd>
                                      </div>
                                      <div className="col-span-2">
                                        <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                                        <dd>
                                          {enrollment.parent?.address.street}
                                          <br />
                                          {enrollment.parent?.address.city}, {enrollment.parent?.address.state} {enrollment.parent?.address.zipCode}
                                        </dd>
                                      </div>
                                    </dl>
                                  </CardContent>
                                </Card>

                                {/* Payment History */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Payment Information</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <dl className="grid grid-cols-2 gap-4">
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                                        <dd>${enrollment.paymentDetails.amount}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                                        <dd>
                                          <Badge
                                            className={getPaymentStatusColor(enrollment.paymentDetails.paymentStatus)}
                                            variant="secondary"
                                          >
                                            {enrollment.paymentDetails.paymentStatus}
                                          </Badge>
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Transaction ID</dt>
                                        <dd>{enrollment.paymentDetails.transactionId || "N/A"}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Payment Method</dt>
                                        <dd>{enrollment.paymentDetails.paymentMethod || "N/A"}</dd>
                                      </div>
                                    </dl>
                                  </CardContent>
                                </Card>

                                {/* Communication History */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Communication History</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    {enrollment.communicationHistory?.length ? (
                                      <div className="space-y-4">
                                        {enrollment.communicationHistory.map((comm) => (
                                          <div
                                            key={comm.id}
                                            className="border rounded-lg p-4"
                                          >
                                            <div className="flex justify-between items-start mb-2">
                                              <Badge variant="outline">
                                                {comm.type}
                                              </Badge>
                                              <span className="text-sm text-muted-foreground">
                                                {format(new Date(comm.timestamp), "MMM dd, yyyy HH:mm")}
                                              </span>
                                            </div>
                                            <p className="text-sm">{comm.content}</p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">
                                        No communication history available
                                      </p>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
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
  );
} 