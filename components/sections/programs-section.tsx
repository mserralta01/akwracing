"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Flag, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const programs = [
  {
    title: "Beginner Course",
    description: "Perfect for newcomers to racing. Learn the fundamentals of kart racing and safety protocols.",
    icon: Users,
    price: "$499",
    duration: "4 weeks"
  },
  {
    title: "Advanced Training",
    description: "Intensive training for experienced racers looking to compete professionally.",
    icon: Zap,
    price: "$899",
    duration: "8 weeks"
  },
  {
    title: "Race Ready",
    description: "Elite program preparing you for professional racing competitions.",
    icon: Flag,
    price: "$1,299",
    duration: "12 weeks"
  }
]

export function ProgramsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className="py-20 bg-gray-900" id="programs">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Racing Programs</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the program that matches your skill level and racing ambitions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <program.icon className="h-10 w-10 text-red-500 mb-4" />
                  <CardTitle className="text-white">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{program.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-500 font-bold">{program.price}</span>
                    <span className="text-gray-500">{program.duration}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}