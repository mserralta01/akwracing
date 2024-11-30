import { type Metadata } from "next";
import { FacilityCard, type FacilityProps } from "@/components/facilities/facility-card";
import { HeroSection } from "@/components/facilities/hero-section";

export const metadata: Metadata = {
  title: "Professional Racing Academy Facilities | AKW Racing Karting School",
  description: "Explore AKW Racing Academy's world-class karting facilities in Florida. From professional race tracks to advanced simulators, we provide elite training facilities for young racers aged 5-15. Join the premier youth racing academy that develops future motorsport champions.",
  keywords: "karting academy, racing school, youth racing program, professional karting, racing academy Florida, junior racing development, karting training facility, motorsport education, racing simulator training, professional race track",
  openGraph: {
    title: "Professional Racing Academy Facilities | AKW Racing Karting School",
    description: "Elite karting facilities designed for young racers. Professional tracks, advanced simulators, and comprehensive training facilities to develop future motorsport champions.",
    images: [
      {
        url: "/images/PiquetTrack.webp",
        width: 1200,
        height: 630,
        alt: "AKW Racing Academy Professional Race Track",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Racing Academy Facilities | AKW Racing",
    description: "Elite karting facilities designed for young racers. Professional tracks, advanced simulators, and comprehensive training facilities to develop future motorsport champions.",
    images: ["/images/PiquetTrack.webp"],
  },
};

const facilities: FacilityProps[] = [
  {
    title: "AKW Racing Academy Training Center",
    location: "Wellington, FL",
    description: "Our state-of-the-art racing academy headquarters is the epicenter of young driver development, purposefully designed for aspiring champions aged 5-15. This comprehensive facility combines cutting-edge technology, professional instruction, and specialized training environments to nurture the next generation of motorsport talent. From our advanced simulators to our fully-equipped maintenance bays, every aspect is optimized for youth development and safety.",
    features: [
      "Professional race strategy and analytics center",
      "Youth-focused physical conditioning facility",
      "Advanced driver development classrooms",
      "State-of-the-art kart maintenance workshop",
      "Dedicated parent observation areas",
      "Professional race preparation zones",
      "Performance analysis technology suite"
    ],
    stats: [
      { label: "Training Zones", value: "4" },
      { label: "Service Bays", value: "3" },
      { label: "Classroom Spaces", value: "2" },
      { label: "Analysis Stations", value: "4" }
    ],
    sections: [
      {
        title: "Professional Racing Headquarters",
        description: "Our Wellington headquarters serves as the command center for developing future racing champions. Featuring state-of-the-art facilities for both theoretical and practical training, our academy provides a comprehensive learning environment that covers every aspect of professional racing.",
        imageSrc: "/images/akwracingheadquarters.jpg",
        imageAlt: "AKW Racing Academy Professional Training Facility Interior"
      },
      {
        title: "Advanced Simulation Training Center",
        description: "Our cutting-edge simulator facility features professional-grade racing simulators specifically calibrated for young drivers. These advanced systems allow drivers to master racing techniques, learn track layouts, and develop strategic thinking in a safe, controlled environment.",
        simulatorImages: [
          {
            src: "/images/kartsimpro.jpg",
            alt: "Professional Youth Racing Simulator Training"
          },
          {
            src: "/images/wilma.webp",
            alt: "Advanced Junior Karting Simulator"
          }
        ]
      },
      {
        title: "Mobile Racing Operations Unit",
        description: "Our professional racing trailer represents AKW Racing Academy's commitment to comprehensive race support. Fully equipped with tools, spare parts, and mobile workshop capabilities, this mobile unit ensures our young racers have professional-level support at every competition and training event across the country.",
        imageSrc: "/images/akwracingtrailor.jpg",
        imageAlt: "AKW Racing Academy Professional Racing Support Trailer"
      }
    ]
  },
  {
    title: "Professional Race Track - Piquet Race Park",
    location: "16169 Southern Boulevard, Loxahatchee Groves FL 33470",
    description: "Our main racing academy track is specially designed for youth driver development, featuring multiple configurations to suit different skill levels and age groups. This professional facility offers the perfect environment for young racers to progress from their first laps to competitive racing, with comprehensive safety measures and professional instruction at every step.",
    features: [
      "FIA-approved youth racing circuit",
      "Progressive track configurations for different skill levels",
      "Complete safety equipment and protocols",
      "Professional race control and monitoring",
      "Youth-specific training zones",
      "Parent viewing areas and facilities"
    ],
    stats: [
      { label: "Track Length", value: "1 Mile" },
      { label: "Safety Rating", value: "A+" },
      { label: "Training Zones", value: "5" },
      { label: "Track Variants", value: "3" }
    ],
    imageSrc: "/images/PiquetTrack.webp",
    imageAlt: "Professional Youth Karting Track at Piquet Race Park"
  },
  {
    title: "AMR Homestead-Miami Racing Academy Circuit",
    location: "1835 SE 38th Avenue, Homestead, FL 33035",
    description: "Our advanced training facility caters to developing young racers ready for more challenging experiences. This professional-grade track offers varied racing conditions and advanced training programs, providing the perfect stepping stone for junior racers advancing toward professional motorsport careers.",
    features: [
      "Advanced youth racing circuits",
      "Professional race simulation facilities",
      "Specialized junior driver training areas",
      "Competition preparation facilities",
      "Youth development programs"
    ],
    stats: [
      { label: "Track Grade", value: "Pro" },
      { label: "Safety Level", value: "Elite" },
      { label: "Training Areas", value: "4" },
      { label: "Race Support", value: "Full" }
    ],
    imageSrc: "/images/HomesteadTrack.jpg",
    imageAlt: "Professional Youth Racing Development Track at AMR Homestead-Miami"
  }
];

export default function FacilitiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 via-white to-gray-50">
      <HeroSection />

      <section className="relative py-16 lg:py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
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

        <div className="container relative mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-24">
              {facilities.map((facility, index) => (
                <div 
                  key={index} 
                  className="relative"
                >
                  {index > 0 && (
                    <div className="absolute -top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
                  )}
                  <FacilityCard {...facility} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
      </section>
    </main>
  );
}
