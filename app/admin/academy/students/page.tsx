"use client";

import { useState, useEffect } from "react";
import { StudentProfile } from "@/types/user";
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
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  User,
} from "lucide-react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsRef = collection(db, "students");
      const studentsQuery = query(
        studentsRef,
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(studentsQuery);
      const studentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as StudentProfile[];

      setStudents(studentsData);
    } catch (error) {
      console.error("Error loading students:", error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const searchString = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchString) ||
      student.lastName.toLowerCase().includes(searchString) ||
      student.email.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <p className="text-muted-foreground">
          View and manage student profiles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Students List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                View and manage student profiles
              </CardDescription>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Birth Date</TableHead>
                    <TableHead>Parent Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {student.firstName} {student.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {student.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{student.phoneNumber}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(student.birthDate).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.parentName && (
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium">
                              {student.parentName}
                            </span>
                            {student.parentPhone && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{student.parentPhone}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Student Details */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
              <CardDescription>
                View student information and medical details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStudent ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Personal Information</h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedStudent.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedStudent.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(selectedStudent.birthDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold">Emergency Contact</h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedStudent.emergencyContact.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-sm text-muted-foreground">
                          {selectedStudent.emergencyContact.relationship}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedStudent.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold">Medical Information</h3>
                    {selectedStudent.medicalInformation ? (
                      <div className="space-y-2">
                        {selectedStudent.medicalInformation.allergies && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Allergies</span>
                            <p className="text-sm text-muted-foreground">
                              {selectedStudent.medicalInformation.allergies}
                            </p>
                          </div>
                        )}
                        {selectedStudent.medicalInformation.medications && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Medications</span>
                            <p className="text-sm text-muted-foreground">
                              {selectedStudent.medicalInformation.medications}
                            </p>
                          </div>
                        )}
                        {selectedStudent.medicalInformation.conditions && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Medical Conditions</span>
                            <p className="text-sm text-muted-foreground">
                              {selectedStudent.medicalInformation.conditions}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span>No medical information provided</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a student to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 