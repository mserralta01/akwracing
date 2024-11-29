"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { InstructorForm } from "@/components/admin/instructor-form";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";

export default function EditInstructorPage() {
  const params = useParams();
  const instructorId = params?.instructorId as string;
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      if (!instructorId) return;

      try {
        const instructorData = await instructorService.getInstructor(instructorId);
        setInstructor(instructorData);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [instructorId]);

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

  if (!instructor) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            Instructor not found or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Instructor</h1>
        <p className="text-muted-foreground">
          Make changes to instructor information
        </p>
      </div>
      <InstructorForm initialData={instructor} isEditing />
    </div>
  );
} 