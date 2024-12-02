import { Metadata } from 'next'
import { courseService } from '@/lib/services/course-service'
import { CourseDetails } from "@/components/courses/course-details"
import { notFound } from 'next/navigation'
import { type PageProps } from '@/types/next'

type Props = PageProps<{
  courseName: string;
}>

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const course = await courseService.getCourse(resolvedParams.courseName)
  
  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.'
    }
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
  }
}

export default async function CoursePage({ params, searchParams }: Props) {
  const resolvedParams = await params
  const course = await courseService.getCourse(resolvedParams.courseName)

  if (!course) {
    notFound()
  }

  return <CourseDetails initialCourse={course} />
} 