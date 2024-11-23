"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Map, Shield } from "lucide-react";

const facilities = [
  {
    title: "Professional Karts",
    description: "Top-of-the-line Sodi Karts equipped with Rotax engines",
    icon: Settings,
  },
  {
    title: "World-Class Track",
    description: "Professional-grade racing circuit at Piquet Race Park",
    icon: Map,
  },
  {
    title: "Safety Equipment",
    description: "Latest safety gear and protective equipment provided",
    icon: Shield,
  },
];

export function FacilitiesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Facilities
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Experience racing excellence with our state-of-the-art facilities and equipment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <Icon className="h-12 w-12 text-racing-red mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                    <p className="text-gray-500">{facility.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="https://placehold.co/800x600/1a1a1a/ffffff?text=Racing+Track"
              alt="Racing Track"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="https://placehold.co/800x600/1a1a1a/ffffff?text=Racing+Equipment"
              alt="Racing Equipment"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}