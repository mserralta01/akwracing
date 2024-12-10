import { Course } from "@/types/course";
import { Instructor } from "@/types/instructor";
import { CourseDetails } from "@/components/admin/course-details";

interface CourseListProps {
  courses: Course[];
  instructors: Instructor[];
}

export function CourseList({ courses, instructors }: CourseListProps) {
  return (
    <div className="mt-4">
      {courses.map((course) => (
        <div key={course.id} className="mb-4">
          <CourseDetails course={course} instructors={instructors} />
        </div>
      ))}
    </div>
  );
} 