"use client";

import { useState, useEffect } from "react";
import { Enrollment } from "@/types/user";
import { enrollmentService } from "@/lib/services/enrollment-service";
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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(
    null
  );
  const [note, setNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const searchString = searchTerm.toLowerCase();
    return (
      enrollment.user?.name.toLowerCase().includes(searchString) ||
      enrollment.course?.title.toLowerCase().includes(searchString) ||
      enrollment.status.toLowerCase().includes(searchString)
    );
  });

  const handleAddNote = async () => {
    if (!selectedEnrollment || !note.trim()) {
      return;
    }

    try {
      const result = await enrollmentService.addNoteToEnrollment(
        selectedEnrollment.id,
        note
      );
      if (result.success) {
        setNote("");
        setIsDialogOpen(false);
        loadEnrollments();
      } else if (result.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Course Enrollments</h1>
        <p className="text-muted-foreground">
          Manage and track student enrollments
        </p>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search enrollments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enrolled On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEnrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell>{enrollment.user?.name}</TableCell>
              <TableCell>{enrollment.course?.title}</TableCell>
              <TableCell>{enrollment.status}</TableCell>
              <TableCell>
                {format(new Date(enrollment.createdAt), "PPP")}
              </TableCell>
              <TableCell>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedEnrollment(enrollment)}
                    >
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Note to Enrollment</DialogTitle>
                      <DialogDescription>
                        Add a note about this student's enrollment
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Enter your note here..."
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddNote}>Add Note</Button>
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