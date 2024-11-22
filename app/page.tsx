"use client"

import { NavigationHeader } from "@/components/navigation-header"
import { HeroSection } from "@/components/sections/hero-section"
import { ProgramsSection } from "@/components/sections/programs-section"
import { FacilitiesSection } from "@/components/sections/facilities-section"
import { InstructorsSection } from "@/components/sections/instructors-section"
import { BookingSection } from "@/components/sections/booking-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <NavigationHeader />
      <HeroSection />
      <ProgramsSection />
      <FacilitiesSection />
      <InstructorsSection />
      <BookingSection />
    </main>
  )
}