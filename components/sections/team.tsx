"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { instructorService } from "@/lib/services/instructor-service";
import { roleService } from "@/lib/services/role-service";
import { TeamMemberCard } from "@/components/team/team-member-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Instructor } from "@/types/instructor";

export function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedMembers = async () => {
      try {
        setLoading(true);
        const result = await instructorService.getInstructors({ featured: true });
        setTeamMembers(result.instructors);
      } catch (error) {
        console.error("Error fetching featured team members:", error);
        setError("Failed to load team members");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMembers();
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TeamMemberCard member={member} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            asChild 
            className="bg-racing-red hover:bg-racing-red/90 text-white"
          >
            <Link href="/team">Meet the Entire Team</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 