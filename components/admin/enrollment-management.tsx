"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  Tag,
  MessageSquare,
} from "lucide-react";

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

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enrollments List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enrollments</CardTitle>
              <CardDescription>View and manage enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : enrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No enrollments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>{enrollment.student?.name || "Unknown Student"}</TableCell>
                        <TableCell>{enrollment.course?.title || "Unknown Course"}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              enrollment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : enrollment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {enrollment.status}
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

        {/* Enrollment Details */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Details</CardTitle>
              <CardDescription>
                {selectedEnrollment ? "View enrollment details" : "Select an enrollment to view details"}
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

                  <Separator />

                  <div>
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
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                        <dd>
                          <Badge
                            variant="secondary"
                            className={
                              selectedEnrollment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : selectedEnrollment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {selectedEnrollment.status}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <Separator />

                  <div>
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
                            className={
                              selectedEnrollment.payment?.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : selectedEnrollment.payment?.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {selectedEnrollment.payment?.status || "Unknown"}
                          </Badge>
                        </dd>
                      </div>
                      {selectedEnrollment.payment?.transactionId && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Transaction ID</dt>
                          <dd>{selectedEnrollment.payment.transactionId}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Actions</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          router.push(`/admin/academy/enrollments/${selectedEnrollment.id}/edit`)
                        }
                      >
                        Edit Enrollment
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          router.push(`/admin/academy/enrollments/${selectedEnrollment.id}/notes`)
                        }
                      >
                        View Notes
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select an enrollment to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 