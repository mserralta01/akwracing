"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { studentService } from "@/lib/services/student-service";
import { StudentProfile } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialogFooter
} from "@/components/ui/alert-dialog";

export function StudentList() {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // TODO: Implement pagination
      const allStudents = await studentService.getAllStudents();
      setStudents(allStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchString =
      `${student.firstName} ${student.lastName} ${student.email} ${student.dateOfBirth}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((student) => student.id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedStudents.map((id) => studentService.deleteStudent(id))
      );
      setStudents((prev) =>
        prev.filter((student) => !selectedStudents.includes(student.id))
      );
      setSelectedStudents([]);
      toast({
        title: "Students deleted",
        description: `Successfully deleted ${selectedStudents.length} students.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some students. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-[600px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>
          Manage student profiles and their enrollments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Delete Selected Button */}
            {selectedStudents.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Delete Selected ({selectedStudents.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Students</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedStudents.length}{" "}
                      students? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteSelected}
                      className="bg-red-500 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              onClick={() => router.push("/admin/students/new")}
              className="bg-racing-red hover:bg-racing-red/90"
            >
              Add Student
            </Button>
          </div>

          {/* Students Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedStudents.length === filteredStudents.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Allergies</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleSelectStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {student.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.dateOfBirth ? (
                        <div className="text-sm">
                          {new Date(student.dateOfBirth).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">N/A</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.address ? (
                        <div className="text-sm space-y-1">
                          <div>{student.address.street}</div>
                          <div>
                            {student.address.city}, {student.address.state}{" "}
                            {student.address.zipCode}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          No address provided
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.allergies && student.allergies.length > 0 ? (
                        <Badge variant="secondary">
                          {student.allergies.join(", ")}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Student Details</DialogTitle>
                              <DialogDescription>
                                View and manage student information
                              </DialogDescription>
                            </DialogHeader>
                            {selectedStudent && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <div className="mt-1">
                                      {selectedStudent.firstName}{" "}
                                      {selectedStudent.lastName}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Contact</Label>
                                    <div className="mt-1 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        {selectedStudent.email}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        {selectedStudent.phone}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label>Address</Label>
                                  <div className="mt-1 space-y-1">
                                    <div>{selectedStudent.address?.street}</div>
                                    <div>
                                      {selectedStudent.address?.city},{" "}
                                      {selectedStudent.address?.state}{" "}
                                      {selectedStudent.address?.zipCode}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label>Date of Birth</Label>
                                  <div className="mt-1">
                                    {selectedStudent.dateOfBirth}
                                  </div>
                                </div>

                                <div>
                                  <Label>Allergies</Label>
                                  <div className="mt-1">
                                    {selectedStudent.allergies?.join(", ") ||
                                      "No allergies"}
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      router.push(
                                        `/admin/students/${student.id}/edit`
                                      )
                                    }
                                  >
                                    Edit Profile
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      router.push(
                                        `/admin/students/${student.id}/enrollments`
                                      )
                                    }
                                  >
                                    View Enrollments
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                {student.firstName} {student.lastName}? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await studentService.deleteStudent(
                                      student.id
                                    );
                                    setStudents((prev) =>
                                      prev.filter((s) => s.id !== student.id)
                                    );
                                    toast({
                                      title: "Student deleted",
                                      description:
                                        "The student has been successfully deleted.",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description:
                                        "Failed to delete student. Please try again.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 