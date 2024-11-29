import { type Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Facilities | AKW Racing",
  description: "Explore AKW Racing's world-class facilities including our home track at Piquet Race Park, AMR Homestead, and our high-end headquarters in Wellington, FL.",
};

type FacilityProps = {
  title: string;
  location: string;
  description: string;
  features?: string[];
  imageSrc?: string;
  imageAlt?: string;
  simulatorImages?: Array<{src: string; alt: string}>;
};

const FacilityCard = ({ title, location, description, features, imageSrc, imageAlt, simulatorImages }: FacilityProps) => (
  <Card className="overflow-hidden bg-white shadow-xl">
    {imageSrc && imageAlt && (
      <div className="relative h-[300px] w-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    )}
    {simulatorImages && (
      <div className="grid grid-cols-2 gap-4 p-4">
        {simulatorImages.map((sim, index) => (
          <div key={index} className="relative h-[200px] w-full">
            <Image
              src={sim.src}
              alt={sim.alt}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    )}
    <CardContent className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 font-medium mb-3">{location}</p>
      <p className="text-gray-700 mb-4">{description}</p>
      {features && features.length > 0 && (
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
      )}
    </CardContent>
  </Card>
);

export default function FacilitiesPage() {
  const facilities = [
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

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Our World-Class Facilities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AKW Racing operates across three strategic locations, each designed to provide our drivers with the best possible training, development, and racing experiences. From professional tracks to high-end simulators, we offer comprehensive facilities that cater to every aspect of karting excellence.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {facilities.map((facility, index) => (
            <FacilityCard key={index} {...facility} />
          ))}
        </div>
      </div>
    </div>
  );
}
