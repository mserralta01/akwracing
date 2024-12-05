"use client";

import { useEffect, useState } from "react";
import { CourseForm } from '@/components/admin/course-form';
import { Course } from "@/types/course";
import { Instructor } from "@/types/instructor";
import { courseService } from "@/lib/services/course-service";
import { instructorService } from "@/lib/services/instructor-service";

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | undefined>();
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseData, instructorsData] = await Promise.all([
          courseService.getCourse(params.courseId),
          instructorService.getInstructors()
        ]);
        setCourse(courseData || undefined);
        setInstructors(instructorsData.instructors || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [params.courseId]);

  return <CourseForm initialData={course} instructors={instructors} />;
} 