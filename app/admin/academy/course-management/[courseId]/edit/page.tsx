"use client";

import { useEffect, useState } from "react";
import { CourseForm } from "@/components/admin/course-form";
import { useParams } from "next/navigation";
import { Course } from "@/types/course";
import { Instructor } from "@/types/instructor";
import { courseService } from "@/lib/services/course-service";
import { instructorService } from "@/lib/services/instructor-service";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<Course | undefined>();
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseData, instructorsData] = await Promise.all([
          courseService.getCourse(courseId),
          instructorService.getInstructors()
        ]);
        setCourse(courseData || undefined);
        setInstructors(instructorsData.instructors || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [courseId]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">
          Make changes to your course information
        </p>
      </div>
      <CourseForm initialData={course} instructors={instructors} />
    </div>
  );
} 