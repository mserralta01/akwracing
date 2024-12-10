import { notFound } from 'next/navigation';
import { courseService } from '@/lib/services/course-service';
import { instructorService } from '@/lib/services/instructor-service';
import { CourseDetails } from '@/components/admin/course-details';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DeleteCourseButton } from '@/components/admin/delete-course-button';

interface PageParams {
    id: string;
}

interface PageProps {
    params: PageParams;
}

export default async function CoursePage({ params }: PageProps) {
  const course = await courseService.getCourse(params.id);
  const { instructors } = await instructorService.getInstructors();

  if (course === null) {
    return notFound();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <div className="flex gap-2">
          <Link href={`/admin/academy/courses/${course.id}/edit`}>
            <Button>Edit Course</Button>
          </Link>
          <DeleteCourseButton courseId={course.id} />
        </div>
      </div>
      <div className="mt-4">
        <CourseDetails course={course} instructors={instructors} />
      </div>
    </div>
  );
} 