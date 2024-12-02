import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { studentService } from "@/lib/services/student-service";
import { StudentProfile } from "@/types/student";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StudentList() {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

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

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const searchString = `${student.firstName} ${student.lastName}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
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
                  <TableHead>Student</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Emergency Contact</TableHead>
                  <TableHead>Experience Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(student.dateOfBirth)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{student.emergencyContact.name}</div>
                        <div className="text-muted-foreground">
                          {student.emergencyContact.phone}
                        </div>
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
                                    <div>{selectedStudent.emergencyContact.name}</div>
                                    <div>{selectedStudent.emergencyContact.phone}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {selectedStudent.emergencyContact.relationship}
                                    </div>
                                  </div>
                                </div>

                                {selectedStudent.medicalInformation && (
                                  <div>
                                    <Label>Medical Information</Label>
                                    <div className="mt-1 space-y-2">
                                      {selectedStudent.medicalInformation.allergies.length > 0 && (
                                        <div>
                                          <span className="font-medium">Allergies: </span>
                                          {selectedStudent.medicalInformation.allergies.join(", ")}
                                        </div>
                                      )}
                                      {selectedStudent.medicalInformation.medications.length > 0 && (
                                        <div>
                                          <span className="font-medium">Medications: </span>
                                          {selectedStudent.medicalInformation.medications.join(", ")}
                                        </div>
                                      )}
                                      {selectedStudent.medicalInformation.conditions.length > 0 && (
                                        <div>
                                          <span className="font-medium">Conditions: </span>
                                          {selectedStudent.medicalInformation.conditions.join(", ")}
                                        </div>
                                      )}
                                      {selectedStudent.medicalInformation.notes && (
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
                                    <Label>Racing Experience</Label>
                                    <div className="mt-1 space-y-2">
                                      <div>
                                        <span className="font-medium">Years of Experience: </span>
                                        {selectedStudent.experience.yearsOfExperience}
                                      </div>
                                      {selectedStudent.experience.previousCourses.length > 0 && (
                                        <div>
                                          <span className="font-medium">Previous Courses: </span>
                                          {selectedStudent.experience.previousCourses.join(", ")}
                                        </div>
                                      )}
                                      <div>
                                        <span className="font-medium">Skill Level: </span>
                                        <Badge>{selectedStudent.experience.skillLevel}</Badge>
                                      </div>
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