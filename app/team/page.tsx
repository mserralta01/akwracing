import { TeamMemberGrid } from "@/components/team/team-member-grid";
import { roleService } from "@/lib/services/role-service";

export default async function TeamPage() {
  const roles = await roleService.getRoles();
  
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          Champions Teaching
          <span className="text-racing-red"> Future Champions</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Learn from an elite team of racing professionals who've dominated tracks worldwide. 
          Our instructors bring decades of F1, karting, and professional racing experience 
          to develop the next generation of motorsport champions.
        </p>
      </div>
      <TeamMemberGrid roles={roles} />
    </div>
  );
} 