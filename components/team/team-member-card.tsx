import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Instructor } from "@/types/instructor";
import { icons } from "@/lib/constants/icons";

type TeamMemberCardProps = {
  member: Instructor;
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <Image
          src={member.imageUrl || "/placeholder-instructor.jpg"}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-2">{member.name}</h3>
        <p className="text-racing-red font-semibold mb-2">{member.role}</p>
        
        {/* Display top 2 experiences */}
        <div className="space-y-2 mb-4">
          {member.experiences.slice(0, 2).map((experience, i) => (
            <div key={i} className="flex items-center gap-2">
              {icons[experience.icon] && (
                <div className="h-4 w-4 text-racing-red">
                  {React.createElement(icons[experience.icon])}
                </div>
              )}
              <span className="text-sm">{experience.description}</span>
            </div>
          ))}
        </div>

        {/* Display top 2 achievements */}
        <div className="space-y-2">
          {member.achievements.slice(0, 2).map((achievement, i) => (
            <div key={i} className="flex items-center gap-2">
              {icons[achievement.icon] && (
                <div className="h-4 w-4 text-racing-red">
                  {React.createElement(icons[achievement.icon])}
                </div>
              )}
              <span className="text-sm">{achievement.description}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 