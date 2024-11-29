"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { courseService } from "@/lib/services/course-service";
import { Course, CourseLevel } from "@/types/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";

export function ProgramsSection() {
  const router = useRouter();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        console.log('Fetching featured courses...');
        const result = await courseService.getCourses(
          { featured: true },
          "startDate"
        );
        console.log('Featured courses result:', result.courses);
        setFeaturedCourses(result.courses);
      } catch (error) {
        console.error("Error fetching featured courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
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
    <section className="py-20 bg-gradient-to-b from-racing-black to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Training Programs
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose from our selection of premier racing courses designed for all skill levels
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => router.push(`/courses/${course.id}`)}
                >
                  <div className="relative h-48">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    <Badge variant={getLevelBadgeVariant(course.level)}>
                      {course.level}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {course.shortDescription}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(course.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {course.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {course.availableSpots} spots left
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold">${course.price}</span>
                      <Button>Enroll Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => router.push('/courses')}
            className="bg-racing-red hover:bg-red-700"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
}