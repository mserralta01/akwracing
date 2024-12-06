"use client";

import { useState, useEffect } from "react";
import { StudentProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // TODO: Implement student service and fetch students
      setStudents([]);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchString = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchString) ||
      student.lastName.toLowerCase().includes(searchString) ||
      student.email.toLowerCase().includes(searchString)
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">View and manage student profiles</p>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date of Birth</TableHead>
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
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{student.email}</span>
                  </div>
                  {student.phoneNumber && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{student.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {student.dateOfBirth && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(student.dateOfBirth), "PPP")}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Student Details</DialogTitle>
                      <DialogDescription>
                        View detailed information about this student
                      </DialogDescription>
                    </DialogHeader>
                    {selectedStudent && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Personal Information</h3>
                          <div className="mt-2 space-y-2">
                            <p>
                              <span className="text-muted-foreground">Name:</span>{" "}
                              {selectedStudent.firstName} {selectedStudent.lastName}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Email:</span>{" "}
                              {selectedStudent.email}
                            </p>
                            {selectedStudent.phoneNumber && (
                              <p>
                                <span className="text-muted-foreground">
                                  Phone:
                                </span>{" "}
                                {selectedStudent.phoneNumber}
                              </p>
                            )}
                            {selectedStudent.dateOfBirth && (
                              <p>
                                <span className="text-muted-foreground">
                                  Date of Birth:
                                </span>{" "}
                                {format(new Date(selectedStudent.dateOfBirth), "PPP")}
                              </p>
                            )}
                          </div>
                        </div>
                        {selectedStudent.address && (
                          <div>
                            <h3 className="font-medium">Address</h3>
                            <div className="mt-2 space-y-2">
                              {selectedStudent.address.street && (
                                <p>
                                  <span className="text-muted-foreground">
                                    Street:
                                  </span>{" "}
                                  {selectedStudent.address.street}
                                </p>
                              )}
                              {selectedStudent.address.city && (
                                <p>
                                  <span className="text-muted-foreground">
                                    City:
                                  </span>{" "}
                                  {selectedStudent.address.city}
                                </p>
                              )}
                              {selectedStudent.address.state && (
                                <p>
                                  <span className="text-muted-foreground">
                                    State:
                                  </span>{" "}
                                  {selectedStudent.address.state}
                                </p>
                              )}
                              {selectedStudent.address.postalCode && (
                                <p>
                                  <span className="text-muted-foreground">
                                    Postal Code:
                                  </span>{" "}
                                  {selectedStudent.address.postalCode}
                                </p>
                              )}
                              {selectedStudent.address.country && (
                                <p>
                                  <span className="text-muted-foreground">
                                    Country:
                                  </span>{" "}
                                  {selectedStudent.address.country}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {selectedStudent.emergencyContact && (
                          <div>
                            <h3 className="font-medium">Emergency Contact</h3>
                            <div className="mt-2 space-y-2">
                              <p>
                                <span className="text-muted-foreground">
                                  Name:
                                </span>{" "}
                                {selectedStudent.emergencyContact.name}
                              </p>
                              <p>
                                <span className="text-muted-foreground">
                                  Relationship:
                                </span>{" "}
                                {selectedStudent.emergencyContact.relationship}
                              </p>
                              <p>
                                <span className="text-muted-foreground">
                                  Phone:
                                </span>{" "}
                                {selectedStudent.emergencyContact.phoneNumber}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 