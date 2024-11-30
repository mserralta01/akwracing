"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const safetyFeatures = [
  {
    title: "Professional Equipment",
    description: "State-of-the-art safety gear including helmets, suits, and neck braces",
    icon: Shield,
  },
  {
    title: "Safety Protocols",
    description: "Comprehensive safety briefings and strict track regulations",
    icon: CheckCircle,
  },
  {
    title: "Emergency Response",
    description: "Trained medical staff and emergency procedures in place",
    icon: AlertCircle,
  },
];

export function SafetySection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-navy-900 to-navy-800">
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

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Safety First</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your safety is our top priority. We maintain the highest safety standards
            in karting education and track operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}