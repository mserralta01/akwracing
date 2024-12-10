import { courseService } from "@/lib/services/course-service";
import { instructorService } from "@/lib/services/instructor-service";
import { CourseList } from "@/components/admin/course-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CoursesPage() {
  const { courses } = await courseService.getCourses();
  const { instructors } = await instructorService.getInstructors();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Link href="/admin/academy/courses/new">
          <Button>Create Course</Button>
        </Link>
      </div>
      <div className="mt-4">
        <CourseList courses={courses} instructors={instructors} />
      </div>
    </div>
  );
} 