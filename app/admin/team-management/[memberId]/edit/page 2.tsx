"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TeamForm } from "@/components/admin/team-form";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";

export default function EditTeamMemberPage() {
  const params = useParams();
  const memberId = params?.memberId as string;
  const [member, setMember] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      if (!memberId) return;

      try {
        const memberData = await instructorService.getInstructor(memberId);
        setMember(memberData);
      } catch (error) {
        console.error("Error fetching team member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-[600px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            Team member not found or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Team Member</h1>
        <p className="text-muted-foreground">
          Make changes to team member information
        </p>
      </div>
      <TeamForm initialData={member} isEditing />
    </div>
  );
} 