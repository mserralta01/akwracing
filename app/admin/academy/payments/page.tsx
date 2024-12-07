"use client";

import { useState, useEffect } from "react";
import { Enrollment } from "@/types/student";
import { enrollmentService } from "@/lib/services/enrollment-service";
import { paymentService } from "@/lib/services/payment-service";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, RefreshCcw } from "lucide-react";

type ServiceEnrollment = Awaited<ReturnType<typeof enrollmentService.getAllEnrollments>>[number];

const convertServiceEnrollmentToEnrollment = (serviceEnrollment: ServiceEnrollment): Enrollment => ({
  id: serviceEnrollment.id || crypto.randomUUID(),
  studentId: serviceEnrollment.userId || crypto.randomUUID(),
  parentId: "",
  courseId: serviceEnrollment.courseId || crypto.randomUUID(),
  status: serviceEnrollment.status === "active" ? "confirmed" : 
          serviceEnrollment.status === "completed" ? "completed" : "cancelled",
  createdAt: serviceEnrollment.enrollmentDate?.toISOString() || new Date().toISOString(),
  updatedAt: serviceEnrollment.lastAccessedDate?.toISOString() || serviceEnrollment.enrollmentDate?.toISOString() || new Date().toISOString(),
  paymentDetails: {
    amount: 0,
    currency: "USD",
    paymentStatus: "pending",
  },
  notes: [],
  communicationHistory: [],
  student: {
    name: "Unknown Student",
    email: "",
    phone: "",
  },
  course: {
    title: "Unknown Course",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  },
  payment: {
    amount: 0,
    currency: "USD",
    status: "pending",
    transactionId: undefined,
  },
});

export default function PaymentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getAllEnrollments();
      setEnrollments(data.map(convertServiceEnrollmentToEnrollment));
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

  const handleRefund = async (enrollment: Enrollment) => {
    if (!enrollment.payment?.transactionId || !enrollment.payment?.amount) return;
    
    try {
      setProcessing(enrollment.id);
      await paymentService.refundPayment(enrollment.payment.transactionId, enrollment.payment.amount);
      toast({
        title: "Success",
        description: "Payment refunded successfully",
      });
      loadEnrollments();
    } catch (error) {
      console.error("Error refunding payment:", error);
      toast({
        title: "Error",
        description: "Failed to refund payment",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>View and manage course payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : enrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.student?.name || "Unknown Student"}</TableCell>
                    <TableCell>{enrollment.course?.title || "Unknown Course"}</TableCell>
                    <TableCell>
                      ${enrollment.payment?.amount.toFixed(2) || "0.00"}{" "}
                      {enrollment.payment?.currency || "USD"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          enrollment.payment?.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : enrollment.payment?.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {enrollment.payment?.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {enrollment.payment?.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefund(enrollment)}
                          disabled={processing === enrollment.id}
                        >
                          {processing === enrollment.id ? (
                            <RefreshCcw className="h-4 w-4 animate-spin" />
                          ) : (
                            <DollarSign className="h-4 w-4" />
                          )}
                          <span className="ml-2">Refund</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 