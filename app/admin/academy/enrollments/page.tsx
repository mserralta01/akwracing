"use client";

import { useState, useEffect } from "react";
import { Enrollment } from "@/types/user";
import { enrollmentService } from "@/lib/services/enrollment-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [note, setNote] = useState("");
  const [tag, setTag] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      // In a real application, you would implement pagination and filters
      const result = await enrollmentService.getEnrollmentsForCourse("");
      if (result.success && result.enrollments) {
        setEnrollments(result.enrollments);
      }
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

  const handleAddNote = async () => {
    if (!selectedEnrollment || !note.trim()) return;

    try {
      const result = await enrollmentService.addNoteToEnrollment(
        selectedEnrollment.id,
        note
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Note added successfully",
        });
        setNote("");
        loadEnrollments();
      } else {
        throw new Error(result.error?.message);
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = async () => {
    if (!selectedEnrollment || !tag.trim()) return;

    try {
      const result = await enrollmentService.addTagToEnrollment(
        selectedEnrollment.id,
        tag
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Tag added successfully",
        });
        setTag("");
        loadEnrollments();
      } else {
        throw new Error(result.error?.message);
      }
    } catch (error) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: Enrollment['status']) => {
    switch (status) {
      case 'enrolled':
        return 'success';
      case 'payment_pending':
        return 'warning';
      case 'payment_failed':
        return 'destructive';
      case 'cancelled':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.studentProfile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.studentProfile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.studentProfile.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Enrollment Management</h1>
        <p className="text-muted-foreground">
          Manage and track student enrollments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Enrollments List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enrollments</CardTitle>
              <CardDescription>
                View and manage course enrollments
              </CardDescription>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search enrollments..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="enrolled">Enrolled</SelectItem>
                    <SelectItem value="payment_pending">Payment Pending</SelectItem>
                    <SelectItem value="payment_failed">Payment Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map((enrollment) => (
                    <TableRow
                      key={enrollment.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedEnrollment(enrollment)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {enrollment.studentProfile.firstName}{" "}
                            {enrollment.studentProfile.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {enrollment.studentProfile.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>Course Name</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={enrollment.paymentStatus === 'completed' ? 'success' : 'warning'}>
                          {enrollment.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
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
                View and manage enrollment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEnrollment ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Student Information</h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedEnrollment.studentProfile.firstName}{" "}
                          {selectedEnrollment.studentProfile.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedEnrollment.studentProfile.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedEnrollment.studentProfile.phoneNumber}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold">Payment Information</h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${selectedEnrollment.amount} {selectedEnrollment.currency}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Badge variant={selectedEnrollment.paymentStatus === 'completed' ? 'success' : 'warning'}>
                          {selectedEnrollment.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEnrollment.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add tag..."
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddTag}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold">Notes</h3>
                    <div className="space-y-2">
                      {selectedEnrollment.notes?.map((note, index) => (
                        <div
                          key={index}
                          className="text-sm p-2 bg-muted rounded-md"
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add note..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddNote}
                      >
                        <Plus className="h-4 w-4" />
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