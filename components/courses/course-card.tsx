import { Course, CourseLevel } from "@/types/course";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { generateCourseSlug } from "@/lib/utils/slug";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const getLevelBadgeVariant = (level: CourseLevel) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-500 hover:bg-emerald-600 text-white";
      case "Intermediate":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "Advanced":
        return "bg-racing-red hover:bg-red-700 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date TBD';
      }
      return date.toLocaleDateString();
    } catch (error) {
      return 'Date TBD';
    }
  };

  const handleLearnMore = () => {
    if (!course.slug) {
      console.error('Course slug is missing:', course);
      return;
    }
    router.push(`/courses/${course.slug}`);
  };

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48">
        <div className="absolute top-2 left-2 z-20">
          <Badge 
            className={`${getLevelBadgeVariant(course.level)} px-4 py-0.5 text-sm font-medium rounded-sm`}
          >
            {course.level}
          </Badge>
        </div>
        
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      <CardHeader>
        <h3 className="text-xl font-bold">{course.title}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">{course.shortDescription}</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-racing-red" />
              <span>Starts: {formatDate(course.startDate)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-racing-red" />
              <span>{course.availableSpots} spots remaining</span>
            </div>
            <div className="flex items-center text-sm font-semibold">
              <DollarSign className="h-4 w-4 mr-2 text-racing-red" />
              <span>${course.price}</span>
            </div>
          </div>
          <Button
            className="w-full bg-racing-red hover:bg-red-700 text-white"
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 