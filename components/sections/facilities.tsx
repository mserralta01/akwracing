"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type FacilityCardProps = {
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
  className: string;
};

const FacilityCard = ({ title, description, features, imageSrc, imageAlt, className }: FacilityCardProps) => (
  <div className={`${className} bg-navy-700/50 backdrop-blur-sm border-navy-600`}>
    <CardContent className="p-0">
      <div className="aspect-video relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
        <ul className="grid grid-cols-2 gap-2">
          {features.map((feature, featureIndex) => (
            <li
              key={featureIndex}
              className="flex items-center text-sm text-gray-300"
            >
              <CheckCircle2 className="h-4 w-4 mr-2 text-racing-red" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </div>
);

export const FacilitiesSection = () => {
  const facilities = [
    {
      title: "AKW Racing Academy Training Center",
      description: "Our state-of-the-art racing academy headquarters in Wellington, FL combines cutting-edge technology with professional instruction. From advanced simulators to fully-equipped maintenance bays, every aspect is optimized for youth development and safety.",
      features: [
        "Professional race strategy center",
        "2 Full motion racing simulators",
        "Advanced driver development classrooms",
        "Professional maintenance garage",
        "Equipment storage and warehouse",
        "Parts department",
      ],
      imageSrc: "/images/akwracingheadquarters.jpg",
      imageAlt: "AKW Racing Headquarters",
      className: "md:col-span-2", // Full width for headquarters
    },
    {
      title: "Race Track - Piquet Race Park",
      description: "Our main racing academy track in Loxahatchee, FL features multiple configurations for different skill levels. This professional facility offers the perfect environment for young racers to progress from their first laps to competitive racing.",
      features: [
        "FIA-approved youth racing circuit",
        "Progressive track configurations",
        "Professional race control",
        "Complete safety protocols",
      ],
      imageSrc: "/images/PiquetTrack.webp",
      imageAlt: "Piquet Entertainment Race Track",
      className: "md:col-span-1", // Half width for tracks
    },
    {
      title: "AMR Homestead-Miami Circuit",
      description: "Our advanced training facility caters to developing young racers ready for more challenging experiences. This professional-grade track provides the perfect stepping stone for junior racers advancing toward professional careers.",
      features: [
        "Advanced youth racing circuits",
        "Competition preparation facilities",
        "Professional race simulation",
        "Elite safety standards",
      ],
      imageSrc: "/images/HomesteadTrack.jpg",
      imageAlt: "AMR Homestead-Miami Racing Circuit",
      className: "md:col-span-1", // Half width for tracks
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-navy-800 to-navy-900">
      {/* Racing-inspired background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(0,0,0,0.1) 0px,
            rgba(0,0,0,0.1) 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Our Facilities</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience racing excellence at our premier facilities, equipped with
            everything needed for professional racing development.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {facilities.map((facility, index) => (
            <FacilityCard key={index} {...facility} />
          ))}
        </div>
      </div>
    </section>
  );
};