"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { icons } from "@/lib/constants/icons";
import * as React from "react";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const result = await instructorService.getInstructors();
        setInstructors(result.instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

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

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Meet Our Elite Racing Instructors
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Learn from champions who have mastered the art of racing. Our
              instructors bring decades of professional experience and a passion for
              developing the next generation of racing talent.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20"
          >
            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
              <Trophy className="h-8 w-8 text-racing-red mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-white mb-2">50+</h3>
              <p className="text-gray-300">Championship Titles</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
              <Star className="h-8 w-8 text-racing-red mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-white mb-2">25+</h3>
              <p className="text-gray-300">Years Experience</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
              <Trophy className="h-8 w-8 text-racing-red mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-white mb-2">1000+</h3>
              <p className="text-gray-300">Students Trained</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instructors Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeletons
              [...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white/5 backdrop-blur-sm">
                    <div className="relative h-64 bg-gray-800/50 animate-pulse" />
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-800/50 rounded animate-pulse" />
                        <div className="h-4 bg-gray-800/50 rounded w-2/3 animate-pulse" />
                        <div className="h-4 bg-gray-800/50 rounded w-3/4 animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              instructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-gray-800">
                    <div className="relative h-64">
                      <Image
                        src={instructor.imageUrl || "/placeholder-instructor.jpg"}
                        alt={instructor.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {instructor.name}
                      </h3>
                      <p className="text-racing-red font-semibold mb-4">
                        {instructor.role}
                      </p>

                      {/* Experiences */}
                      <div className="space-y-2 mb-4">
                        {instructor.experiences.slice(0, 2).map((experience, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {icons[experience.icon] && (
                              <div className="h-4 w-4 text-racing-red">
                                {React.createElement(icons[experience.icon])}
                              </div>
                            )}
                            <span className="text-sm text-gray-300">
                              {experience.description}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Achievements */}
                      <div className="space-y-2">
                        {instructor.achievements.slice(0, 2).map((achievement, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {icons[achievement.icon] && (
                              <div className="h-4 w-4 text-racing-red">
                                {React.createElement(icons[achievement.icon])}
                              </div>
                            )}
                            <span className="text-sm text-gray-300">
                              {achievement.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 