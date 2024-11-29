"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Course, CourseLevel } from "@/types/course";
import { courseService } from "@/lib/services/course-service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function ProgramsSection() {
  const router = useRouter();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching featured courses...');
        
        const result = await courseService.getCourses(
          { featured: true },
          "startDate"
        );
        
        console.log('Featured courses result:', result);
        
        if (!result || !result.courses) {
          throw new Error('No courses data received');
        }
        
        setFeaturedCourses(result.courses);
      } catch (error) {
        console.error("Error fetching featured courses:", error);
        setError(error instanceof Error ? error.message : 'Failed to load courses');
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

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-racing-black to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300" />
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featuredCourses.length === 0 ? (
          <div className="text-center text-gray-300">
            No featured courses available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden bg-card hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <Badge variant={getLevelBadgeVariant(course.level as CourseLevel)}>
                        {course.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.shortDescription}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">${course.price}</span>
                      <Button
                        variant="default"
                        onClick={() => router.push(`/courses/${course.id}`)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}