"use client";

import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="relative bg-[#1a1e31] py-24 lg:py-32 overflow-hidden">
      {/* Racing-inspired background pattern */}
      <div className="absolute inset-0 z-0">
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

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h1 
            className="mb-8 text-5xl font-bold text-white lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Our World-Class{" "}
            <span className="text-racing-red">Facilities</span>
          </motion.h1>
          
          <motion.p 
            className="mx-auto mb-12 max-w-3xl text-lg text-gray-300 lg:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            AKW Racing operates across three strategic locations, each designed to provide
            our drivers with the best possible training, development, and racing experiences.
            From professional tracks to high-end simulators, we offer comprehensive
            facilities that cater to every aspect of karting excellence.
          </motion.p>

          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-racing-red"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </motion.div>
      </div>

      {/* Racing flag pattern overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`${i % 2 === 0 ? "bg-white" : "bg-transparent"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
