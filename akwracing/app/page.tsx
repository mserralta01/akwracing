"use client";

import { HeroSection } from "@/components/sections/hero";
import { ProgramsSection } from "@/components/sections/programs";
import { FacilitiesSection } from "@/components/sections/facilities";
import { SafetySection } from "@/components/sections/safety";
import { ContactSection } from "@/components/sections/contact";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProgramsSection />
      <FacilitiesSection />
      <SafetySection />
      <ContactSection />
    </>
  );
} 