"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useRouter } from "next/navigation";

export function AboutSection() {
  const router = useRouter();

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-navy-900 to-navy-800">
      {/* Racing-inspired background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.1) 0px,
            rgba(255,255,255,0.1) 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Excellence in Racing Education
            </h2>
            <p className="text-gray-300 mb-6">
              Located in the heart of Wellington, FL, AKW Racing Academy partners with
              Piquet Race Park to provide world-class karting education. Our state-of-the-art
              facility and experienced instructors ensure that every student receives
              the highest quality training.
            </p>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center">
                <ArrowRight className="h-5 w-5 text-racing-red mr-2" />
                <span>Professional race instructors</span>
              </div>
              <div className="flex items-center">
                <ArrowRight className="h-5 w-5 text-racing-red mr-2" />
                <span>State-of-the-art racing equipment</span>
              </div>
              <div className="flex items-center">
                <ArrowRight className="h-5 w-5 text-racing-red mr-2" />
                <span>Comprehensive training programs</span>
              </div>
            </div>
            <Button 
              className="mt-8 bg-racing-red hover:bg-red-700"
              onClick={() => router.push('/courses')}
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/images/akwracingtrailor.jpg"
              alt="AKW Racing Academy Facility"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
    </section>
  );
}