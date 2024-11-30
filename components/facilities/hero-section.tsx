"use client";

import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-navy-900">
      {/* Racing-inspired background pattern - Lowered z-index */}
      <div className="absolute inset-0 -z-10">
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

      {/* Content - Ensure positive z-index */}
      <div className="relative z-10 container mx-auto px-4">
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
            Professional Youth Racing{" "}
            <span className="text-racing-red">Academy Facilities</span>
          </motion.h1>
          
          <motion.p 
            className="mx-auto mb-6 max-w-3xl text-xl text-gray-300 lg:text-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Welcome to Florida's premier youth karting academy, where future racing champions begin their journey.
          </motion.p>

          <motion.p 
            className="mx-auto mb-12 max-w-3xl text-lg text-gray-300 lg:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Our professional facilities are specifically designed for young drivers aged 5-15, combining world-class tracks, advanced simulators, and comprehensive training areas to provide the perfect environment for developing professional racing careers.
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
    </div>
  );
};
