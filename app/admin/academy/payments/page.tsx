"use client";

import { useEffect, useState } from "react";
import { Enrollment } from "@/types/student";
import { enrollmentService } from "@/lib/services/enrollment-service";
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

export default function PaymentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getAllEnrollments();
      setEnrollments(data);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payments List */}
        <div className="md:col-span-2">
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
                          ${enrollment.payment?.amount?.toFixed(2) || "0.00"}{" "}
                          {enrollment.payment?.currency || "USD"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getPaymentStatusColor(enrollment.payment?.status || "pending")}
                          >
                            {enrollment.payment?.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEnrollment(enrollment)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Payment Details */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                {selectedEnrollment ? "View payment details" : "Select a payment to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEnrollment ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                        <dd>{selectedEnrollment.student?.name || "Unknown"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                        <dd>{selectedEnrollment.student?.email || "N/A"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                        <dd>{selectedEnrollment.student?.phone || "N/A"}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Course Information</h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Course</dt>
                        <dd>{selectedEnrollment.course?.title || "Unknown Course"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Dates</dt>
                        <dd>
                          {selectedEnrollment.course?.startDate
                            ? new Date(selectedEnrollment.course.startDate).toLocaleDateString()
                            : "N/A"}{" "}
                          -{" "}
                          {selectedEnrollment.course?.endDate
                            ? new Date(selectedEnrollment.course.endDate).toLocaleDateString()
                            : "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                        <dd>
                          ${selectedEnrollment.payment?.amount?.toFixed(2) || "0.00"}{" "}
                          {selectedEnrollment.payment?.currency || "USD"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                        <dd>
                          <Badge
                            variant="secondary"
                            className={getPaymentStatusColor(
                              selectedEnrollment.payment?.status || "pending"
                            )}
                          >
                            {selectedEnrollment.payment?.status || "pending"}
                          </Badge>
                        </dd>
                      </div>
                      {selectedEnrollment.payment?.transactionId && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Transaction ID
                          </dt>
                          <dd>{selectedEnrollment.payment.transactionId}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {selectedEnrollment.notes && selectedEnrollment.notes.length > 0 && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Notes</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {selectedEnrollment.notes.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a payment to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 