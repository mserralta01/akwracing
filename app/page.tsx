"use client";

import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { BenefitsSection } from "@/components/sections/benefits";
import { ProgramsSection } from "@/components/sections/programs";
import { InstructorsSection } from "@/components/sections/instructors";
import { FacilitiesSection } from "@/components/sections/facilities";
import { SafetySection } from "@/components/sections/safety";
import { ContactSection } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <ProgramsSection />
      <InstructorsSection />
      <FacilitiesSection />
      <SafetySection />
      <ContactSection />
    </>
  );
}