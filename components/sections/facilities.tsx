"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type FacilityCardProps = {
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
};

const FacilityCard = ({ title, description, features, imageSrc, imageAlt }: FacilityCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-lg shadow-xl overflow-hidden"
  >
    <div className="relative h-64 w-full">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <svg
              className="w-5 h-5 text-primary mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

export const FacilitiesSection = () => {
  const facilities = [
    {
      title: "Race Track - Piquet Entertainment",
      description: "Our primary racing facility located in Loxahatchee, Florida, providing a professional racing environment for training and competitions.",
      features: [
        "Professional-grade race track",
        "State-of-the-art racing equipment",
        "Expert instruction facilities",
        "Safety equipment and protocols",
      ],
      imageSrc: "/images/racetrack.jpg", // You'll need to add these images
      imageAlt: "Piquet Entertainment Race Track",
    },
    {
      title: "AKW Racing Headquarters",
      description: "Our Wellington, FL headquarters serves as our main operations center, featuring comprehensive training and maintenance facilities.",
      features: [
        "2 Full motion racing simulators",
        "Professional maintenance garage",
        "Equipment storage and warehouse",
        "Agility and reflex training equipment",
        "Dedicated workout room",
        "Parts department",
      ],
      imageSrc: "/images/headquarters.jpg", // You'll need to add these images
      imageAlt: "AKW Racing Headquarters",
    },
  ];

  return (
    <section id="facilities" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Facilities</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience racing excellence at our two premier facilities, equipped with
            everything you need for professional racing development.
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