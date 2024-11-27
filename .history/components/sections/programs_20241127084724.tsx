"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export function ProgramsSection() {
  // Define the type for the course
  type Course = {
    id: string;
    name: string;
    price: string;
    description: string;
    // Add other fields as necessary
  };

  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      const q = query(collection(db, "courses"), where("featured", "==", true));
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeaturedCourses(courses);
    };

    fetchFeaturedCourses();
  }, []);

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
            Training Programs
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the program that matches your skill level and racing ambitions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden border-2 border-racing-gray hover:border-racing-red transition-colors">
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-racing-red mb-4">
                    {course.price}
                  </p>
                  <p className="text-gray-500 mb-6">{course.description}</p>
                  <Button className="w-full bg-racing-red hover:bg-red-700">
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}