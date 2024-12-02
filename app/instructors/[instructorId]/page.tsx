"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";
import { icons } from "@/lib/constants/icons";
import { Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import * as React from "react";

export default function InstructorDetailPage() {
  const params = useParams();
  const instructorId = params?.instructorId as string;
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      if (!instructorId) return;

      try {
        const instructorData = await instructorService.getInstructor(instructorId);
        setInstructor(instructorData);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800">
        <div className="container mx-auto py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="aspect-[3/2] bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800">
        <div className="container mx-auto py-16">
          <div className="text-center text-white">
            <p>Instructor not found or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'youtube': return Youtube;
      default: return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800">
      {/* Racing-inspired background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #000 0px,
              #000 1px,
              transparent 1px,
              transparent 10px
            )`,
          }}
        />
      </div>

      <div className="container relative mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Image Section */}
          <div className="relative aspect-[3/4] lg:aspect-square">
            <Image
              src={instructor.imageUrl || "/placeholder-instructor.jpg"}
              alt={instructor.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl font-bold text-white mb-4"
              >
                {instructor.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl text-racing-red font-semibold mb-6"
              >
                {instructor.role}
              </motion.p>
              
              {/* Bio Section */}
              <Card className="bg-white/5 backdrop-blur-sm border-gray-800">
                <CardContent className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ 
                      __html: instructor.bio 
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Social Media */}
            {instructor.socialMedia && Object.entries(instructor.socialMedia).some(([_, url]) => url) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center gap-4"
              >
                {Object.entries(instructor.socialMedia).map(([platform, url]) => {
                  const Icon = getSocialIcon(platform);
                  if (Icon && url) {
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-racing-red transition-colors"
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    );
                  }
                  return null;
                })}
              </motion.div>
            )}

            {/* Experiences */}
            {instructor.experiences.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white">Racing Experience</h2>
                <div className="grid gap-4">
                  {instructor.experiences.map((experience, index) => (
                    <Card key={index} className="bg-white/5 backdrop-blur-sm border-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-20 text-sm text-gray-500">
                            {experience.year}
                          </div>
                          <div className="flex items-start gap-3 flex-1">
                            {icons[experience.icon] && (
                              <div className="h-5 w-5 text-racing-red flex-shrink-0 mt-1">
                                {React.createElement(icons[experience.icon])}
                              </div>
                            )}
                            <p className="text-gray-300 flex-1">{experience.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            {instructor.achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white">Achievements</h2>
                <div className="grid gap-4">
                  {instructor.achievements.map((achievement, index) => (
                    <Card key={index} className="bg-white/5 backdrop-blur-sm border-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-20 text-sm text-gray-500">
                            {achievement.year}
                          </div>
                          <div className="flex items-start gap-3 flex-1">
                            {icons[achievement.icon] && (
                              <div className="h-5 w-5 text-racing-red flex-shrink-0 mt-1">
                                {React.createElement(icons[achievement.icon])}
                              </div>
                            )}
                            <p className="text-gray-300 flex-1">{achievement.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 