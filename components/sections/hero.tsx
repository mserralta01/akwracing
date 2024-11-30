"use client";

import { motion } from "framer-motion";
import TypewriterComponent from "typewriter-effect";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-navy-900">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source 
            src="https://www.sodikart.com/content/files/home/sodikart-home-v2.mp4" 
            type="video/mp4" 
          />
        </video>
      </div>

      {/* Racing-inspired background pattern */}
      <div className="absolute inset-0 z-20">
        {/* Diagonal stripes */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.03) 0px,
              rgba(255,255,255,0.03) 2px,
              transparent 2px,
              transparent 12px
            )`
          }}
        />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1e31]/80 via-[#1a1e31]/60 to-[#1a1e31]/90" />
        
        {/* Racing line accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-racing-red to-transparent" />
      </div>

      <div className="container relative z-30 mx-auto px-4 text-center">
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
                  "Welcome to <span style='color: #FF0000'>AKW Racing Academy</span>",
                  "Where <span style='color: #FF0000'>Champions</span> Are Made",
                  "Start Your Racing Journey",
                ],
                autoStart: true,
                loop: true,
                cursor: "|",
                wrapperClassName: "text-white",
                cursorClassName: "text-white",
                typeSpeed: 50,
                deleteSpeed: 50,
                autoStyled: true,
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
              className="bg-white text-racing-black hover:bg-gray-100 border-white"
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .Typewriter__wrapper span {
          color: #FF0000; /* racing-red color */
        }
      `}</style>
    </section>
  );
}