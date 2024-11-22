"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Trophy, Star, Award } from "lucide-react"
import Image from "next/image"

const instructors = [
  {
    name: "Michael Anderson",
    role: "Head Coach",
    experience: "15+ years",
    achievements: "3x National Champion",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    specialties: ["Advanced Racing", "Race Strategy", "Professional Development"]
  },
  {
    name: "Sarah Martinez",
    role: "Technical Coach",
    experience: "12+ years",
    achievements: "Technical Director, FIA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    specialties: ["Kart Setup", "Race Engineering", "Data Analysis"]
  },
  {
    name: "James Wilson",
    role: "Junior Development Coach",
    experience: "8+ years",
    achievements: "Youth Program Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    specialties: ["Youth Training", "Fundamentals", "Safety Training"]
  }
]

export function InstructorsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className="py-20 bg-gray-900" id="instructors">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Expert Instructors</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Learn from championship-winning racers with decades of combined experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{instructor.name}</h3>
                <p className="text-red-500 font-semibold mb-4">{instructor.role}</p>
                
                <div className="flex items-center mb-3">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-gray-300">{instructor.experience}</span>
                </div>
                
                <div className="flex items-center mb-4">
                  <Award className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-gray-300">{instructor.achievements}</span>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}