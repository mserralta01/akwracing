"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export type FacilitySection = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  simulatorImages?: Array<{src: string; alt: string}>;
};

export type FacilityProps = {
  title: string;
  location: string;
  description: string;
  features: string[];
  stats?: Array<{
    label: string;
    value: string;
  }>;
  sections?: FacilitySection[];
  imageSrc?: string;
  imageAlt?: string;
  simulatorImages?: Array<{src: string; alt: string}>;
};

export const FacilityCard = ({ 
  title, 
  location, 
  description, 
  features, 
  stats,
  sections,
  imageSrc, 
  imageAlt,
  simulatorImages
}: FacilityProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full w-full"
    >
      <Card className="group h-full overflow-hidden bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
        {/* Image Section */}
        <div className="relative">
          {imageSrc && imageAlt && (
            <div className="relative h-[500px] w-full overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-8">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-white mb-3"
                >
                  {title}
                </motion.h3>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center text-white/90"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  <span className="text-lg">{location}</span>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-8 lg:p-10">
          {!imageSrc && (
            <>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-4xl font-bold text-gray-900"
              >
                {title}
              </motion.h3>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 flex items-center text-gray-600"
              >
                <MapPin className="mr-2 h-5 w-5 text-racing-red" />
                <span className="text-lg font-medium">{location}</span>
              </motion.div>
            </>
          )}

          {/* Stats Grid */}
          {stats && (
            <div className="mb-8 grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="rounded-xl bg-gray-50 p-6 text-center"
                >
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-racing-red">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <p className="mb-8 text-lg leading-relaxed text-gray-700">{description}</p>

            {/* Facility Sections */}
            {sections && (
              <div className="mt-12 space-y-16">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative"
                  >
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h4>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">{section.description}</p>
                    
                    {section.imageSrc && (
                      <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                        <Image
                          src={section.imageSrc}
                          alt={section.imageAlt || ""}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                        />
                      </div>
                    )}

                    {section.simulatorImages && (
                      <div className="grid grid-cols-2 gap-6 mb-12">
                        {section.simulatorImages.map((sim, simIndex) => (
                          <motion.div 
                            key={simIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: simIndex * 0.2 }}
                            className="relative h-[300px] w-full overflow-hidden rounded-xl"
                          >
                            <Image
                              src={sim.src}
                              alt={sim.alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Features Section - Moved below simulator section */}
            <div className="mt-12">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Facility Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 bg-gray-50 p-6 rounded-xl"
                  >
                    <svg
                      className="h-6 w-6 mt-1 flex-shrink-0 text-racing-red"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span className="text-lg font-medium text-gray-900">{feature}</span>
                      <p className="mt-2 text-gray-600">
                        {getFeatureDescription(feature)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

// Helper function to get feature descriptions
const getFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    "Professional race strategy and analytics center": "State-of-the-art facility equipped with advanced telemetry systems and data analysis tools for comprehensive race strategy development.",
    "Youth-focused physical conditioning facility": "Specialized fitness center designed for young racers, featuring age-appropriate equipment and training programs.",
    "Advanced driver development classrooms": "Modern learning spaces with simulation technology and interactive teaching tools for theoretical race craft education.",
    "State-of-the-art kart maintenance workshop": "Fully equipped workshop with professional tools and diagnostic equipment for optimal kart performance and maintenance.",
    "Dedicated parent observation areas": "Comfortable viewing spaces with live timing displays and direct views of the track and training areas.",
    "Professional race preparation zones": "Dedicated areas for pre-race setup, equipment checks, and mental preparation.",
    "Performance analysis technology suite": "Cutting-edge facility with video analysis tools, data logging systems, and performance monitoring equipment."
  };

  return descriptions[feature] || "";
};
