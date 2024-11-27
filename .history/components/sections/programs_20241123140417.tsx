"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, Trophy, Zap, ArrowRight } from "lucide-react";

const programs = [
  {
    title: "Beginner Course",
    description: "Perfect for newcomers to karting. Learn the fundamentals of racing.",
    price: "$299",
    features: ["Basic driving techniques", "Safety procedures", "Track etiquette"],
    icon: Flag,
  },
  {
    title: "Advanced Training",
    description: "Take your racing skills to the next level with advanced techniques.",
    price: "$499",
    features: ["Race line mastery", "Advanced braking", "Corner techniques"],
    icon: Zap,
  },
  {
    title: "Race Ready",
    description: "Intensive program for aspiring competitive racers.",
    price: "$799",
    features: ["Race strategy", "Competition prep", "Data analysis"],
    icon: Trophy,
  },
];

export function ProgramsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-racing-black to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Training Programs
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the program that matches your skill level and racing ambitions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="relative overflow-hidden border-2 border-racing-gray hover:border-racing-red transition-colors">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-racing-red mb-4" />
                    <CardTitle>{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-racing-red mb-4">
                      {program.price}
                    </p>
                    <p className="text-gray-500 mb-6">{program.description}</p>
                    <ul className="space-y-3 mb-6">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-racing-red mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-racing-red hover:bg-red-700">
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}