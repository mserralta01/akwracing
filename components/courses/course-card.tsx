import { Course, CourseLevel } from "@/types/course";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

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

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48">
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
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{course.title}</h3>
          <Badge variant="secondary">{course.level}</Badge>
        </div>
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
            onClick={() => router.push(`/courses/${course.id}`)}
          >
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 