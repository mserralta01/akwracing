"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";
import Image from "next/image";

export default function InstructorManagement() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchInstructors = async () => {
    try {
      const result = await instructorService.getInstructors();
      setInstructors(result.instructors);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch instructors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleDelete = async (instructorId: string) => {
    if (!window.confirm("Are you sure you want to delete this instructor?")) return;

    try {
      await instructorService.deleteInstructor(instructorId);
      toast({
        title: "Success",
        description: "Instructor deleted successfully",
      });
      fetchInstructors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete instructor",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Instructors</CardTitle>
        <Button onClick={() => router.push("/admin/academy/instructor-management/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Instructor
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-7 gap-4 p-4 border-b font-medium">
            <div className="col-span-2">Name</div>
            <div>Role</div>
            <div>Experience</div>
            <div>Phone</div>
            <div>Email</div>
            <div className="text-right">Actions</div>
          </div>
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : instructors.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No instructors found
            </div>
          ) : (
            instructors.map((instructor) => (
              <div
                key={instructor.id}
                className="grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center"
              >
                <div className="col-span-2 font-medium flex items-center gap-3">
                  {instructor.imageUrl && (
                    <Image
                      src={instructor.imageUrl}
                      alt={instructor.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  {instructor.name}
                </div>
                <div>{instructor.role}</div>
                <div>
                  {instructor.experiences?.map((exp, index) => (
                    <span key={index}>
                      {exp.description}
                      {index < (instructor.experiences?.length || 0) - 1 ? ", " : ""}
                    </span>
                  )) || "No experience listed"}
                </div>
                <div>{instructor.phone || "N/A"}</div>
                <div>{instructor.email || "N/A"}</div>
                <div className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/academy/instructor-management/${instructor.id}/edit`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(instructor.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 