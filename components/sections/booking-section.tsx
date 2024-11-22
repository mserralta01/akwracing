"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { BookingForm } from "@/components/booking-form"

export function BookingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-black" id="booking">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Book Your Course</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Start your racing journey today with our professional training programs
          </p>
        </motion.div>

        <BookingForm />
      </div>
    </section>
  )
}