import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Instructor } from "@/types/instructor";
import { icons } from "@/lib/constants/icons";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

type TeamMemberCardProps = {
  member: Instructor;
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative h-64">
        <Image
          src={member.imageUrl || "/placeholder-instructor.jpg"}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">{member.name}</h3>
            <p className="text-racing-red font-semibold">{member.role}</p>
          </div>
          
          {/* Social Media Links - Now aligned right on same line as name */}
          {member.socialMedia && Object.entries(member.socialMedia).some(([_, url]) => url) && (
            <div className="flex items-center gap-2">
              {member.socialMedia.instagram && (
                <a 
                  href={member.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-racing-red transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {member.socialMedia.facebook && (
                <a 
                  href={member.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-racing-red transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {member.socialMedia.linkedin && (
                <a 
                  href={member.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-racing-red transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {member.socialMedia.twitter && (
                <a 
                  href={member.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-racing-red transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
        
        {/* Experiences Section */}
        {member.experiences.length > 0 && (
          <div className="space-y-3">
            {member.experiences.slice(0, 2).map((experience, i) => (
              <div key={i} className="flex items-start gap-3">
                {icons[experience.icon] && (
                  <div className="h-5 w-5 text-racing-red flex-shrink-0 mt-0.5">
                    {React.createElement(icons[experience.icon])}
                  </div>
                )}
                <span className="text-sm">{experience.description}</span>
              </div>
            ))}
          </div>
        )}

        {/* Achievements Section */}
        {member.achievements.length > 0 && (
          <div className="space-y-3">
            {member.achievements.slice(0, 2).map((achievement, i) => (
              <div key={i} className="flex items-start gap-3">
                {icons[achievement.icon] && (
                  <div className="h-5 w-5 text-racing-red flex-shrink-0 mt-0.5">
                    {React.createElement(icons[achievement.icon])}
                  </div>
                )}
                <span className="text-sm">{achievement.description}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 