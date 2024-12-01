"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";
import { icons } from "@/lib/constants/icons";

export function InstructorsSection() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedInstructors = async () => {
      try {
        setLoading(true);
        const result = await instructorService.getInstructors({ featured: true });
        setInstructors(result.instructors);
      } catch (error) {
        console.error("Error fetching featured instructors:", error);
        setError("Failed to load instructors");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedInstructors();
  }, []);

  if (error) {
    return (
      <section className="py-20 bg-racing-black">
        <div className="container mx-auto px-4 text-center text-gray-300">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-racing-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Elite Racing Mentors Shaping Future Champions
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
          Train with championship-winning professionals who've mastered the art of transforming young talent into racing excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden">
                  <div className="relative h-64 bg-gray-800 animate-pulse" />
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-800 rounded animate-pulse" />
                      <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse" />
                      <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : instructors.length === 0 ? (
            <div className="col-span-3 text-center text-gray-300">
              No featured instructors available at the moment.
            </div>
          ) : (
            instructors.map((instructor, index) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={instructor.imageUrl || "/placeholder-instructor.jpg"}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{instructor.name}</h3>
                    <p className="text-racing-red font-semibold mb-2">{instructor.role}</p>
                    
                    {/* Display top 2 experiences */}
                    <div className="space-y-2 mb-4">
                      {instructor.experiences.slice(0, 2).map((experience, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {icons[experience.icon] && (
                            <div className="h-4 w-4 text-racing-red">
                              {React.createElement(icons[experience.icon])}
                            </div>
                          )}
                          <span className="text-sm">{experience.description}</span>
                        </div>
                      ))}
                    </div>

                    {/* Display top 2 achievements */}
                    <div className="space-y-2">
                      {instructor.achievements.slice(0, 2).map((achievement, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {icons[achievement.icon] && (
                            <div className="h-4 w-4 text-racing-red">
                              {React.createElement(icons[achievement.icon])}
                            </div>
                          )}
                          <span className="text-sm">{achievement.description}</span>
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
  );
}