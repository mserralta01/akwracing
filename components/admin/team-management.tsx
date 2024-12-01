"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";
import { useToast } from "@/components/ui/use-toast";

export default function TeamManagement() {
  const [members, setMembers] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await instructorService.getInstructors();
      setMembers(data.instructors);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    try {
      await instructorService.deleteInstructor(id);
      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
      fetchMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-[400px] bg-muted rounded" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Members</CardTitle>
        <Button onClick={() => router.push("/admin/team-management/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium">
            <div className="col-span-2">Name</div>
            <div>Role</div>
            <div>Experience</div>
            <div>Contact</div>
            <div className="text-right">Actions</div>
          </div>
          {members.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No team members found
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center"
              >
                <div className="col-span-2 font-medium">{member.name}</div>
                <div>{member.role}</div>
                <div>
                  {member.experiences?.map((exp, index) => (
                    <span key={index}>
                      {exp.description}
                      {index < (member.experiences?.length || 0) - 1 ? ", " : ""}
                    </span>
                  )) || "No experience listed"}
                </div>
                <div>
                  <div>{member.phone || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.email || "N/A"}
                  </div>
                </div>
                <div className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/team-management/${member.id}/edit`)
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 