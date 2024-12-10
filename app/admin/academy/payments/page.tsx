"use client";

import { useEffect, useState } from "react";
import { Enrollment, StudentProfile } from "@/types/student";
import { Course } from "@/types/course";
import { enrollmentService } from "@/lib/services/enrollment-service";
import { courseService } from "@/lib/services/course-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import { 
  Banknote, 
  CalendarRange, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ChevronDown,
  Trash2,
  Calendar,
  Search,
  RefreshCcw,
  Globe,
  ArrowUpDown
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays, startOfYear, parseISO } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { paymentService } from "@/lib/services/payment-service";
import { useTimezone } from '@/contexts/timezone-context';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

const ITEMS_PER_PAGE = 25;

interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt?: string;
}

interface EnrollmentWithCourse extends Omit<Enrollment, 'parentId' | 'createdAt' | 'status' | 'payment'> {
  id: string;
  courseId: string;
  studentId: string;
  parentId?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  course?: Course | null;
  student?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  payment?: Partial<Payment>;
}

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'processing' | 'refunded';

interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  successRate: number;
}

export default function PaymentsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithCourse | null>(null);
  const [refundEnrollment, setRefundEnrollment] = useState<EnrollmentWithCourse | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalPayments: 0,
    totalAmount: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    successRate: 0,
  });
  const [showDetails, setShowDetails] = useState(false);

  const { toast } = useToast();
  const { timezone: contextTimezone, formatDateTime } = useTimezone();

  const timezoneAbbreviations: Record<string, string> = {
    'America/New_York': 'EST',
    'America/Los_Angeles': 'PST',
    'America/Denver': 'MST',
    'America/Chicago': 'CST'
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, dateRange, searchTerm, studentFilter, courseFilter]);

  // Load enrollments with course data
  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getAllEnrollments();
      const enrollmentsWithCourses = await Promise.all(
        data.map(async (enrollment) => {
          try {
            const course = await courseService.getCourse(enrollment.courseId);
            return { ...enrollment, course: course || null };
          } catch (error) {
            console.error(`Error loading course for enrollment ${enrollment.id}:`, error);
            return { ...enrollment, course: null };
          }
        })
      );
      setEnrollments(enrollmentsWithCourses);
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

  const handleDelete = async (enrollmentId: string) => {
    try {
      setDeleteLoading(true);
      await enrollmentService.deleteEnrollment(enrollmentId);
      toast({
        title: "Success",
        description: "Payment record deleted successfully",
      });
      // If the deleted enrollment was selected, clear the selection
      if (selectedEnrollment?.id === enrollmentId) {
        setSelectedEnrollment(null);
      }
      await loadEnrollments(); // Reload the list
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment record",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateSummary = (enrollments: EnrollmentWithCourse[]): PaymentSummary => {
    const summary = enrollments.reduce(
      (acc, enrollment) => {
        acc.totalPayments++;
        acc.totalAmount += enrollment.payment?.amount || 0;

        if (enrollment.payment?.status === "completed") {
          acc.successfulPayments++;
        } else if (enrollment.payment?.status === "failed") {
          acc.failedPayments++;
        } else {
          acc.pendingPayments++;
        }

        return acc;
      },
      {
        totalPayments: 0,
        totalAmount: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        successRate: 0,
      }
    );

    summary.successRate =
      summary.totalPayments > 0
        ? (summary.successfulPayments / summary.totalPayments) * 100
        : 0;

    return summary;
  };

  const filterEnrollments = () => {
    let filtered = [...enrollments];

    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((enrollment) => {
        const paymentDate = enrollment.createdAt ? new Date(enrollment.createdAt) : null;
        if (!paymentDate) return false;
        return (
          paymentDate >= dateRange.from! &&
          paymentDate <= dateRange.to!
        );
      });
    }

    // Search term filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enrollment) => {
          const studentName = `${enrollment.student?.firstName || ''} ${enrollment.student?.lastName || ''}`.toLowerCase();
          return studentName.includes(search) ||
            enrollment.course?.title?.toLowerCase().includes(search) ||
            enrollment.payment?.transactionId?.toLowerCase().includes(search);
        }
      );
    }

    // Student filter
    if (studentFilter && studentFilter !== 'all') {
      filtered = filtered.filter(
        (enrollment) => {
          const studentName = `${enrollment.student?.firstName || ''} ${enrollment.student?.lastName || ''}`;
          return studentName === studentFilter;
        }
      );
    }

    // Course filter
    if (courseFilter && courseFilter !== 'all') {
      filtered = filtered.filter(
        (enrollment) => enrollment.course?.title === courseFilter
      );
    }

    setFilteredEnrollments(filtered);
    setSummary(calculateSummary(filtered));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDatePreset = (preset: 'mtd' | 'ytd' | 'custom') => {
    const now = new Date();
    switch (preset) {
      case 'mtd':
        setDateRange({
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: now,
        });
        break;
      case 'ytd':
        setDateRange({
          from: startOfYear(now),
          to: now,
        });
        break;
      case 'custom':
        // Leave the current date range as is
        break;
    }
  };

  // Get unique student names for filter
  const getUniqueStudents = () => Array.from(
    new Set(
      enrollments
        .map((e) => {
          if (!e.student?.firstName || !e.student?.lastName) return null;
          return `${e.student.firstName} ${e.student.lastName}`;
        })
        .filter((name): name is string => {
          return typeof name === 'string' && name.trim() !== '';
        })
    )
  ).sort();

  // Get unique course titles for filter
  const getUniqueCourses = () => Array.from(
    new Set(
      enrollments
        .map((e) => e.course?.title)
        .filter((title): title is string => {
          return typeof title === 'string' && title.trim() !== '';
        })
    )
  ).sort();

  // Pagination
  const totalPages = Math.ceil(filteredEnrollments.length / ITEMS_PER_PAGE);
  const paginatedEnrollments = filteredEnrollments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefund = async (enrollment: EnrollmentWithCourse) => {
    if (!enrollment.payment?.transactionId || !enrollment.payment?.amount) {
      toast({
        title: "Error",
        description: "Missing payment information",
        variant: "destructive",
      });
      return;
    }

    try {
      setRefundLoading(true);
      
      // Call your payment service's refund method
      const response = await fetch('/api/payment/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: enrollment.payment.transactionId,
          amount: enrollment.payment.amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Refund failed');
      }

      // Update the enrollment's payment status to "refunded"
      const updatedPayment: Partial<Payment> = {
        ...enrollment.payment,
        status: "refunded" as PaymentStatus
      };

      await enrollmentService.updateEnrollment(enrollment.id, {
        payment: updatedPayment
      });

      toast({
        title: "Success",
        description: "Payment refunded successfully",
      });

      // Reload enrollments to get updated status
      await loadEnrollments();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setRefundLoading(false);
    }
  };

  // Get customer name from payment details
  const getCustomerName = (enrollment: EnrollmentWithCourse): string => {
    const student = enrollment.student;
    if (!student) return "Unknown";
    return `${student.firstName || ''} ${student.lastName || ''}`.trim() || "Unknown";
  };

  const columns: ColumnDef<EnrollmentWithCourse>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date/Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dateTime = formatDateTime(row.original.createdAt);
        return (
          <div className="flex flex-col">
            <span>{dateTime.formattedDate}</span>
            <span className="text-sm text-gray-500">{dateTime.formattedTime}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "student",
      header: "Student",
      cell: ({ row }) => getCustomerName(row.original),
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ row }) => row.original.course?.title || "Unknown Course",
    },
    {
      accessorKey: "payment.amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-right">
          ${(row.original.payment?.amount || 0).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "payment.status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getPaymentStatusColor(row.original.payment?.status || "")}>
          {row.original.payment?.status === "completed" 
            ? "Completed" 
            : row.original.payment?.status === "refunded"
            ? "Refunded"
            : row.original.payment?.status || "Unknown"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {row.original.payment?.status === "completed" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="text-white"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refund
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Process Refund</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to process a refund for this payment?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRefund(row.original)}
                    disabled={refundLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {refundLoading ? "Processing..." : "Confirm Refund"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                  disabled={deleteLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Payment Record</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this payment record?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(row.original.id)}
                    disabled={deleteLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>View and manage payment records</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="flex items-center gap-4 mb-6">
            <Card className="flex-1 border-none shadow-none bg-blue-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-600">Total Payments</p>
                    </div>
                    <div className="mt-1">
                      <div className="text-2xl font-bold text-blue-700">{summary.totalPayments}</div>
                      <p className="text-sm text-blue-600/80">
                        ${summary.totalAmount.toFixed(2)} Total
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 border-none shadow-none bg-emerald-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <p className="text-sm font-medium text-emerald-600">Success Rate</p>
                    </div>
                    <div className="mt-1">
                      <div className="text-2xl font-bold text-emerald-700">{summary.successRate.toFixed(1)}%</div>
                      <p className="text-sm text-emerald-600/80">
                        {summary.successfulPayments} of {summary.totalPayments}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 border-none shadow-none bg-amber-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <p className="text-sm font-medium text-amber-600">Pending</p>
                    </div>
                    <div className="mt-1">
                      <div className="text-2xl font-bold text-amber-700">{summary.pendingPayments}</div>
                      <p className="text-sm text-amber-600/80">
                        Awaiting completion
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 border-none shadow-none bg-purple-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarRange className="h-4 w-4 text-purple-600" />
                      <p className="text-sm font-medium text-purple-600">Date Range</p>
                    </div>
                    <div className="mt-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-purple-700 hover:text-purple-800 hover:bg-purple-100 font-normal"
                          >
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd")} -{" "}
                                  {format(dateRange.to, "LLL dd, y")}
                                  <ChevronDown className="ml-2 h-4 w-4" />
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-auto p-2">
                          <div className="flex gap-2 mb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-purple-700 hover:text-purple-800 hover:bg-purple-100"
                              onClick={() => handleDatePreset('mtd')}
                            >
                              MTD
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-purple-700 hover:text-purple-800 hover:bg-purple-100"
                              onClick={() => handleDatePreset('ytd')}
                            >
                              YTD
                            </Button>
                          </div>
                          <DropdownMenuSeparator />
                          <div className="mt-2">
                            <DateRangePicker
                              value={dateRange}
                              onChange={setDateRange}
                            />
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <CalendarRange className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={studentFilter} onValueChange={setStudentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {getUniqueStudents().map(name => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {getUniqueCourses().map(title => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Content */}
          <DataTable
            columns={columns}
            data={paginatedEnrollments}
            initialSorting={[
              {
                id: "createdAt",
                desc: true
              }
            ]}
          />
          
          {/* Pagination */}
          {filteredEnrollments.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              View detailed payment information
            </DialogDescription>
          </DialogHeader>
          
          {selectedEnrollment && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                    <dd>
                      {`${selectedEnrollment.student?.firstName || ''} ${selectedEnrollment.student?.lastName || ''}`}
                    </dd>
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
                        ? format(new Date(selectedEnrollment.course.startDate), "MMM dd, yyyy")
                        : "N/A"}{" "}
                      -{" "}
                      {selectedEnrollment.course?.endDate
                        ? format(new Date(selectedEnrollment.course.endDate), "MMM dd, yyyy")
                        : "N/A"}
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
                    <dd>${(selectedEnrollment.payment?.amount || 0).toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd>
                      <Badge className={getPaymentStatusColor(selectedEnrollment.payment?.status || "")}>
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
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                    <dd>
                      {selectedEnrollment.createdAt
                        ? format(new Date(selectedEnrollment.createdAt), "MMM dd, yyyy h:mm a")
                        : "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 