"use client";

import { TeamForm } from "@/components/admin/team-form";

export default function NewTeamMemberPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Team Member</h1>
        <p className="text-muted-foreground">Add a new member to your racing team</p>
      </div>
      <TeamForm />
    </div>
  );
} 