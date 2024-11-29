"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Course, CourseLevel } from "@/types/course";
import { courseService } from "@/lib/services/course-service";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await courseService.getCourses({});
        setCourses(result.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getLevelBadgeVariant = (level: CourseLevel) => {
    switch (level) {
      case "Beginner":
        return "default";
      case "Intermediate":
        return "secondary";
      case "Advanced":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Accelerate Your Racing Career</h1>
        <p className="text-muted-foreground text-lg mb-2">
          Master the art of racing with our professional-grade courses designed for every skill level.
        </p>
        <p className="text-muted-foreground text-lg">
          From beginner fundamentals to advanced racing techniques, unlock your full potential on the track.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-lg mb-4" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{course.title}</h2>
                      <Badge variant={getLevelBadgeVariant(course.level as CourseLevel)}>
                        {course.level}
                      </Badge>
                    </div>
                    <div 
                      className="text-muted-foreground mb-4"
                      dangerouslySetInnerHTML={{ __html: course.shortDescription }}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{course.duration} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Available Spots</p>
                        <p className="font-medium">{course.availableSpots}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">${course.price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className="bg-racing-red hover:bg-red-700"
                    >
                      More Info
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
