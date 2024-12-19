import { Metadata } from 'next'
import { courseService } from '@/lib/services/course-service'
import { CourseDetails } from "@/components/courses/course-details"
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    courseName: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  // Try to get course by ID first, then by slug if not found
  let course = await courseService.getCourse(resolvedParams.courseName);
  if (!course) {
    course = await courseService.getCourseBySlug(resolvedParams.courseName);
  }
  
  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.'
    };
  }

  return {
    title: course.title,
    description: `Discover the ${course.title} in ${course.location} and improve your child's karting skills with AKW Race Academy @Codebase`,
    openGraph: {
      title: course.title,
      description: `Discover the ${course.title} in ${course.location} and improve your child's karting skills with AKW Race Academy @Codebase`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: `Discover the ${course.title} in ${course.location} and improve your child's karting skills with AKW Race Academy @Codebase`,
    }
  };
}

export default async function CoursePage({ params }: Props) {
  const resolvedParams = await params;
  
  // Try to get course by ID first, then by slug if not found
  let course = await courseService.getCourse(resolvedParams.courseName);
  if (!course) {
    course = await courseService.getCourseBySlug(resolvedParams.courseName);
  }

  if (!course) {
    notFound();
  }

  // Ensure all dates are properly serialized as ISO strings
  const serializedCourse = {
    ...course,
    startDate: course.startDate,
    endDate: course.endDate,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };

  return <CourseDetails initialCourse={serializedCourse} />;
} 