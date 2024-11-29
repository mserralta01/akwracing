import { courseService } from "@/lib/services/course-service";

export async function generateStaticParams() {
  try {
    const { courses } = await courseService.getCourses({});
    return courses.map((course) => ({
      courseId: course.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
} 