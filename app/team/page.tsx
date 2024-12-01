import { TeamMemberGrid } from "@/components/team/team-member-grid";
import { roleService } from "@/lib/services/role-service";

export default async function TeamPage() {
  const roles = await roleService.getRoles();
  
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Meet the Team</h1>
      <p className="text-center text-muted-foreground mb-12">
        Get to know our passionate and experienced team members
      </p>
      <TeamMemberGrid roles={roles} />
    </div>
  );
} 