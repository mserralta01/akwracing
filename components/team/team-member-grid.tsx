"use client";

import { useEffect, useState } from "react";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";
import { Role } from "@/lib/services/role-service";
import { TeamMemberCard } from "./team-member-card";
import { Button } from "@/components/ui/button";

type TeamMemberGridProps = {
  roles: Role[];
};

export function TeamMemberGrid({ roles }: TeamMemberGridProps) {
  const [teamMembers, setTeamMembers] = useState<Instructor[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const data = await instructorService.getInstructors();
        setTeamMembers(data.instructors);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  const filteredMembers = selectedRole === "all" 
    ? teamMembers 
    : teamMembers.filter(member => member.role === selectedRole);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-12 bg-muted rounded-full w-1/3 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <div key={i} className="h-96 bg-muted rounded-lg" />
        ))}
      </div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-4 flex-wrap">
        <Button
          variant={selectedRole === "all" ? "default" : "secondary"}
          className="rounded-full"
          onClick={() => setSelectedRole("all")}
        >
          All
        </Button>
        {roles.map((role) => (
          <Button
            key={role.id}
            variant={selectedRole === role.name ? "default" : "secondary"}
            className="rounded-full"
            onClick={() => setSelectedRole(role.name)}
          >
            {role.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
} 