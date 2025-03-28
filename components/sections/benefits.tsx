"use client";

import { useState, useEffect } from 'react';
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
import { useRouter } from "next/navigation";
import { WebsiteContent, settingsService } from '@/lib/services/settings-service';

// This is the original benefits array that must be preserved
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
  const router = useRouter();
  const [settingsContent, setSettingsContent] = useState<WebsiteContent['benefits'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const websiteContent = await settingsService.getWebsiteContent();
        console.log('Benefits section data:', websiteContent.benefits);
        setSettingsContent(websiteContent.benefits);
      } catch (error) {
        console.error('Error loading benefits content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Get the section title from settings if available
  const sectionTitle = settingsContent?.title || "Why Karting for Your Child?";

  return (
    <section className="relative py-20 bg-gradient-to-b from-navy-800 to-navy-900">
      {/* Racing-inspired background pattern - Update z-index */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.1) 0px,
            rgba(255,255,255,0.1) 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {sectionTitle}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover how karting can shape your child's future through essential life skills and exciting opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            // Try to find a matching benefit in the settings content
            const settingBenefit = settingsContent?.items?.find(item => 
              item.title === benefit.title
            );
            
            // Use the description from settings if available, otherwise use the default
            const description = settingBenefit?.description || benefit.description;
            
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
                      {description}
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
          <p className="text-lg text-gray-300 mb-6">
            Join our community of young racers and start your child's journey to success both on and off the track.
          </p>
          <Button 
            size="lg" 
            className="bg-racing-red hover:bg-red-700 text-white cursor-pointer relative z-20"
            onClick={() => router.push('/contact')}
          >
            Start Your Child's Racing Journey <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}