import { type Metadata } from "next";
import { FacilityCard, type FacilityProps } from "@/components/facilities/facility-card";
import { HeroSection } from "@/components/facilities/hero-section";

export const metadata: Metadata = {
  title: "Facilities | AKW Racing",
  description: "Explore AKW Racing's world-class facilities including our home track at Piquet Race Park, AMR Homestead, and our high-end headquarters in Wellington, FL.",
};

const facilities: FacilityProps[] = [
  {
    title: "Home Track - Piquet Race Park",
    location: "16169 Southern Boulevard, Loxahatchee Groves FL 33470",
    description: "Our home track at Piquet Race Park features one of the largest, safest, and fastest kart tracks in South Florida. The mile-long asphalt track accommodates karts reaching speeds of 45 mph, providing an ideal environment for both experienced racers and newcomers to the sport.",
    features: [
      "Mile-long professional asphalt track",
      "Speeds up to 45 mph",
      "Safety equipment provided",
      "20-kart maximum capacity",
      "Professional racing environment"
    ],
    stats: [
      { label: "Track Length", value: "1 Mile" },
      { label: "Max Speed", value: "45 MPH" },
      { label: "Kart Capacity", value: "20" },
      { label: "Safety Rating", value: "A+" }
    ],
    imageSrc: "/images/PiquetTrack.webp",
    imageAlt: "Piquet Race Park Track"
  },
  {
    title: "AMR Homestead-Miami Motorplex",
    location: "1835 SE 38th Avenue, Homestead, FL 33035",
    description: "Our second training facility at AMR Homestead-Miami Motorplex offers additional opportunities for our drivers to practice and compete on a professional-grade track, expanding our racing capabilities and providing diverse racing experiences.",
    features: [
      "Professional-grade karting track",
      "State-of-the-art facilities",
      "Additional training opportunities",
      "Competitive racing environment"
    ],
    stats: [
      { label: "Track Type", value: "Pro" },
      { label: "Layout", value: "Multi" },
      { label: "Surface", value: "Premium" },
      { label: "Experience", value: "Elite" }
    ],
    imageSrc: "/images/HomesteadTrack.jpg",
    imageAlt: "AMR Homestead-Miami Motorplex Track"
  },
  {
    title: "AKW Racing Headquarters",
    location: "Wellington, FL",
    description: "Our headquarters is where the magic happens - a high-end education, maintenance, and driver development facility. This state-of-the-art complex is designed to foster teamwork and collaboration between coaches, mechanics, and drivers, serving as our central hub for race preparation and training.",
    features: [
      "Full workout room for physical conditioning",
      "Agility training equipment",
      "Two full motion racing simulators",
      "Professional kart maintenance facility",
      "Team meeting and collaboration spaces",
      "Race preparation areas",
      "Advanced driver development programs"
    ],
    stats: [
      { label: "Simulators", value: "2" },
      { label: "Training Areas", value: "4" },
      { label: "Maintenance Bays", value: "3" },
      { label: "Team Spaces", value: "2" }
    ],
    simulatorImages: [
      {
        src: "/images/kartsimpro.jpg",
        alt: "Full Motion Kart Sim Pro Simulator"
      },
      {
        src: "/images/wilma.webp",
        alt: "Wilma Racing Simulator"
      }
    ]
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
                  {/* Decorative line */}
                  {index > 0 && (
                    <div className="absolute -top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
                  )}
                  <FacilityCard {...facility} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
      </section>
    </main>
  );
}
