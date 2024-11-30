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
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-white to-gray-50">
      {/* Background pattern - Lowered z-index */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #000 0px,
            #000 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>

      {/* Content - Ensure positive z-index */}
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <BenefitsSection />
        <ProgramsSection />
        <InstructorsSection />
        <FacilitiesSection />
        <SafetySection />
        <ContactSection />
      </div>

      {/* Bottom racing line accent - Lower z-index */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-racing-red/30 to-transparent -z-10" />
    </main>
  );
}