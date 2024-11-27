"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Brain, 
  Heart, 
  Users, 
  Activity, 
  Target, 
  Clock,
  Handshake,
  Car,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const benefits = [
  {
    icon: Trophy,
    title: "Professional Racing Pathway",
    description: "Follow in the footsteps of F1 champions who started karting at ages 5-7. Open doors to racing academies and professional teams.",
  },
  {
    icon: Brain,
    title: "Cognitive Development",
    description: "Enhance quick decision-making, spatial awareness, and strategic thinking while processing information under pressure.",
  },
  {
    icon: Heart,
    title: "Personal Growth",
    description: "Build confidence, discipline, and resilience through handling victory and defeat, developing a strong work ethic.",
  },
  {
    icon: Users,
    title: "Social Skills",
    description: "Make lifelong friendships with like-minded peers while developing sportsmanship in a supportive racing community.",
  },
  {
    icon: Activity,
    title: "Active Lifestyle",
    description: "Trade screen time for an exciting sport that improves physical fitness, hand-eye coordination, and reflexes.",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Progress from basic skills to racing, developing a growth mindset and determination through achievement milestones.",
  },
  {
    icon: Clock,
    title: "Time Management",
    description: "Learn to balance practice schedules, race preparation, and academics while developing organizational skills.",
  },
  {
    icon: Handshake,
    title: "Team Collaboration",
    description: "Experience the power of teamwork through pit crew coordination, strategy planning, and supporting fellow racers in a collaborative environment.",
  },
  {
    icon: Car,
    title: "Future Driving Excellence",
    description: "Develop advanced vehicle control, safety awareness, and crisis management skills that translate into becoming a more capable and responsible future driver.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-racing-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Karting for Your Child?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover how karting can shape your child's future through essential life skills and exciting opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:border-racing-red transition-colors">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-racing-red mb-2" />
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg text-gray-500 mb-6">
            Join our community of young racers and start your child's journey to success both on and off the track.
          </p>
          <Button 
            size="lg" 
            className="bg-racing-red hover:bg-red-700"
          >
            Start Your Child's Racing Journey <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}