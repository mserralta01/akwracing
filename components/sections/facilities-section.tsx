"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Car, Map, Shield } from "lucide-react"

const facilities = [
  {
    title: "Professional Track",
    description: "State-of-the-art racing circuit designed for both learning and competition",
    icon: Map,
    image: "https://images.unsplash.com/photo-1623880840102-7df0a9f3545b"
  },
  {
    title: "Modern Kart Fleet",
    description: "Latest Sodi Karts and Rotax engines maintained to the highest standards",
    icon: Car,
    image: "https://images.unsplash.com/photo-1630003270591-0a9af6337d8"
  },
  {
    title: "Safety Equipment",
    description: "Top-grade safety gear and equipment for all racers",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1623880840102-7df0a9f3545b"
  }
]

export function FacilitiesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className="py-20 bg-black" id="facilities">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Our Facilities</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience racing excellence with our world-class facilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="rounded-lg object-cover w-full h-64"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-4">
                  <facility.icon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-white mb-2">{facility.title}</h3>
                  <p className="text-gray-200 text-sm">{facility.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}