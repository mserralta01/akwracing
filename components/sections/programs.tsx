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
import { Calendar, Users, DollarSign } from "lucide-react";

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
          { featured: true }
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

  // Helper function to strip HTML and truncate
  const truncateDescription = (html: string, maxLength: number): { truncated: string, needsMore: boolean } => {
    if (!html) return { truncated: '', needsMore: false };
    
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    
    if (text.length <= maxLength) {
      return { truncated: text, needsMore: false };
    }
    
    // Find the last space within the maxLength to avoid cutting words
    let truncatedText = text.substring(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      truncatedText = truncatedText.substring(0, lastSpaceIndex);
    }
    
    return { truncated: truncatedText, needsMore: true };
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
    <section className="relative py-20 bg-gradient-to-b from-navy-900 to-navy-800">
      {/* Racing-inspired background pattern - Update z-index */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #000 0px,
            #000 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>

      <div className="container relative z-10 mx-auto px-4">
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
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-gray-300" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => {
              const { truncated, needsMore } = truncateDescription(course.shortDescription, 180);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden h-full relative">
                    <div className="relative h-64">
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
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <Badge 
                          variant={getLevelBadgeVariant(course.level as CourseLevel)}
                          className="mb-4"
                        >
                          {course.level}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                        <p className="text-xl font-bold mb-4">Starting At ${course.price}</p>
                        <div className="text-muted-foreground text-justify min-h-[6em]">
                          {truncated}
                        </div>
                        {needsMore && (
                          <div className="text-left text-gray-400 mb-6">
                            more ...
                          </div>
                        )}
                        <div className="space-y-2 w-full mb-6">
                          <div className="flex items-center justify-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-racing-red" />
                            <span>{formatDate(course.startDate)}</span>
                          </div>
                          <div className="flex items-center justify-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-racing-red" />
                            <span>{course.availableSpots} spots remaining</span>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          className="w-full bg-racing-red hover:bg-red-700 cursor-pointer relative z-20"
                          onClick={() => {
                            if (!course.slug) {
                              console.error('Course slug is missing:', course);
                              return;
                            }
                            router.push(`/courses/${course.slug}`);
                          }}
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}