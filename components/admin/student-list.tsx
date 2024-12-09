"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { studentService, deleteStudent } from "@/lib/services/student-service";
import { StudentProfile } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Calendar,
  Phone,
  Mail,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export function StudentList() {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [pageSize, setPageSize] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);
  const [parentData, setParentData] = useState<Record<string, { firstName: string; lastName: string }>>({});

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // TODO: Implement pagination
      const allStudents = await studentService.getAllStudents();
      setStudents(allStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParentData = async (parentId: string) => {
    try {
      const parent = await studentService.getParent(parentId);
      if (parent) {
        setParentData(prev => ({
          ...prev,
          [parentId]: { firstName: parent.firstName, lastName: parent.lastName }
        }));
      }
    } catch (error) {
      console.error('Error fetching parent:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Fetch parent data for each student
    students.forEach(student => {
      if (student.parentId && !parentData[student.parentId]) {
        fetchParentData(student.parentId);
      }
    });
  }, [students]);

  const filteredStudents = students.filter(student => {
    const searchString = `${student.firstName} ${student.lastName}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedStudents.map(id => deleteStudent(id)));
      setStudents(prev => prev.filter(student => !selectedStudents.includes(student.id)));
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

  // Pagination logic
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * Number(pageSize),
    currentPage * Number(pageSize)
  );

  const totalPages = Math.ceil(filteredStudents.length / Number(pageSize));

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
        <CardDescription>Manage student profiles and enrollments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search, Filters, and Actions */}
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
            
            {/* Page Size Selector */}
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

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
                      Are you sure you want to delete {selectedStudents.length} students? This action cannot be undone.
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
                      checked={selectedStudents.length === filteredStudents.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Experience Level</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
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
                      {calculateAge(student.dateOfBirth)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {student.parentId && parentData[student.parentId] 
                          ? `${parentData[student.parentId].firstName} ${parentData[student.parentId].lastName}`
                          : "No parent assigned"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.experience?.skillLevel && (
                        <Badge>
                          {student.experience.skillLevel}
                        </Badge>
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
                                      {selectedStudent.firstName} {selectedStudent.lastName}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Date of Birth</Label>
                                    <div className="mt-1">
                                      {formatDate(selectedStudent.dateOfBirth)}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label>Emergency Contact</Label>
                                  <div className="mt-1 space-y-1">
                                    {selectedStudent.emergencyContact ? (
                                      <>
                                        <div>{selectedStudent.emergencyContact.name}</div>
                                        <div>{selectedStudent.emergencyContact.phone}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {selectedStudent.emergencyContact.relationship}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-muted-foreground">No emergency contact</div>
                                    )}
                                  </div>
                                </div>

                                {selectedStudent.medicalInformation && (
                                  <div>
                                    <Label>Medical Information</Label>
                                    <div className="mt-1 space-y-2">
                                      {selectedStudent.medicalInformation?.allergies && selectedStudent.medicalInformation.allergies.length > 0 && (
                                        <div>
                                          <span className="font-medium">Allergies: </span>
                                          {selectedStudent.medicalInformation.allergies.join(", ")}
                                        </div>
                                      )}
                                      {selectedStudent.medicalInformation?.conditions && selectedStudent.medicalInformation.conditions.length > 0 && (
                                        <div>
                                          <span className="font-medium">Medical Conditions: </span>
                                          {selectedStudent.medicalInformation.conditions.join(", ")}
                                        </div>
                                      )}
                                      {selectedStudent.medicalInformation?.medications && selectedStudent.medicalInformation.medications.length > 0 && (
                                        <div>
                                          <span className="font-medium">Medications: </span>
                                          {selectedStudent.medicalInformation.medications.join(", ")}
                                        </div>
                                      )}
                                      {selectedStudent.medicalInformation?.notes && (
                                        <div>
                                          <span className="font-medium">Notes: </span>
                                          {selectedStudent.medicalInformation.notes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {selectedStudent.experience && (
                                  <div>
                                    <Label>Experience</Label>
                                    <div className="mt-1 space-y-2">
                                      <div>
                                        <span className="font-medium">Skill Level: </span>
                                        {selectedStudent.experience.skillLevel}
                                      </div>
                                      <div>
                                        <span className="font-medium">Years of Experience: </span>
                                        {selectedStudent.experience.yearsRiding}
                                      </div>
                                      {selectedStudent.experience.previousTraining && (
                                        <div>
                                          <span className="font-medium">Previous Training: </span>
                                          {selectedStudent.experience.previousTraining}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => router.push(`/admin/students/${student.id}/edit`)}
                                  >
                                    Edit Profile
                                  </Button>
                                  <Button
                                    onClick={() => router.push(`/admin/students/${student.id}/enrollments`)}
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
                                Are you sure you want to delete {student.firstName} {student.lastName}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await deleteStudent(student.id);
                                    setStudents(prevStudents => prevStudents.filter(s => s.id !== student.id));
                                    toast({
                                      title: "Student deleted",
                                      description: "The student has been successfully deleted.",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to delete student. Please try again.",
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

          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * Number(pageSize)) + 1} to {Math.min(currentPage * Number(pageSize), filteredStudents.length)} of {filteredStudents.length} students
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 