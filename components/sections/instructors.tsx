"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Award } from "lucide-react";

const instructors = [
  {
    name: "Alex Thompson",
    role: "Head Instructor",
    experience: "15+ years racing experience",
    image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Alex+T",
    achievements: ["3x National Champion", "Professional Race Coach"],
  },
  {
    name: "Sarah Martinez",
    role: "Senior Instructor",
    experience: "12+ years racing experience",
    image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Sarah+M",
    achievements: ["Formula 4 Champion", "Youth Development Specialist"],
  },
  {
    name: "Michael Chen",
    role: "Technical Coach",
    experience: "10+ years racing experience",
    image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Michael+C",
    achievements: ["Race Engineering Expert", "Data Analysis Specialist"],
  },
];

export function InstructorsSection() {
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
            Meet Our Instructors
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Learn from experienced professionals who are passionate about racing and teaching.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{instructor.name}</h3>
                  <p className="text-racing-red font-semibold mb-2">{instructor.role}</p>
                  <p className="text-gray-500 mb-4">{instructor.experience}</p>
                  <div className="space-y-2">
                    {instructor.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center">
                        {i === 0 ? (
                          <Trophy className="h-4 w-4 text-racing-red mr-2" />
                        ) : (
                          <Star className="h-4 w-4 text-racing-red mr-2" />
                        )}
                        <span className="text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}