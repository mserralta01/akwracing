import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CourseForm } from "@/components/admin/course-form";
import { courseService } from "@/lib/services/course-service";
import { Course } from "@/types/course";
import { useToast } from "@/components/ui/use-toast";

export async function generateStaticParams() {
  const courses = await courseService.getAllCourses();
  return courses.map((course) => ({ courseId: course.id }));
}

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch course details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mb-4" />
          <div className="h-4 w-48 bg-muted rounded mb-8" />
          <div className="space-y-4">
            <div className="h-[600px] bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>
            The course you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <CourseForm initialData={course} isEditing={true} />
      </div>
    </div>
  );
}
