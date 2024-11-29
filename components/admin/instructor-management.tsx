"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";
import Image from "next/image";

export default function InstructorManagement() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const result = await instructorService.getInstructors();
        setInstructors(result.instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

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
          <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium">
            <div className="col-span-2">Name</div>
            <div>Role</div>
            <div>Experience</div>
            <div>Featured</div>
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
                className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center"
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
                  {instructor.experiences.map((exp, index) => (
                    <span key={index}>
                      {exp.year}{index < instructor.experiences.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
                <div>
                  {instructor.featured ? (
                    <Badge>Featured</Badge>
                  ) : (
                    <Badge variant="outline">Not Featured</Badge>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/academy/instructor-management/${instructor.id}/edit`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this instructor?")) {
                        try {
                          await instructorService.deleteInstructor(instructor.id);
                          setInstructors(instructors.filter((i) => i.id !== instructor.id));
                        } catch (error) {
                          console.error("Error deleting instructor:", error);
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 