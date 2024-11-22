"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580397581145-cdb6a35b7d3f')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AKW Racing Academy
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Where Champions Are Made
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            Start Your Journey <ChevronRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}