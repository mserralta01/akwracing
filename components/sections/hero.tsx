"use client";

import { motion } from "framer-motion";
import TypewriterComponent from "typewriter-effect";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://placehold.co/2000x1000/1a1a1a/ffffff?text=Racing+Track')",
          filter: "brightness(0.3)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <TypewriterComponent
              options={{
                strings: [
                  "Welcome to AKW Racing Academy",
                  "Where Champions Are Made",
                  "Start Your Racing Journey",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Premier karting academy in Wellington, FL, offering professional race training
            for all skill levels.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              size="lg"
              className="bg-racing-red hover:bg-red-700 text-white"
            >
              Start Racing <Trophy className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-racing-black"
            >
              Learn More <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}