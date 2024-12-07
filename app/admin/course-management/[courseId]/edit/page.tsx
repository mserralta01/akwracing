"use client";

import { EditCourseContent } from "./edit-course-content";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

export default function Page() {
  const params = useParams();
  
  if (!params?.courseId) {
    notFound();
  }

  return <EditCourseContent courseId={params.courseId as string} />;
} 