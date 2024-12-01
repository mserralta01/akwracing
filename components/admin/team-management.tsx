"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Instructor } from "@/types/instructor";
import { instructorService } from "@/lib/services/instructor-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Pencil, 
  Plus, 
  Trash2, 
  Search,
  Filter,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Trophy,
  Medal
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function TeamManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const [members, setMembers] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await instructorService.getInstructors();
      setMembers(data.instructors);
    } catch (error) {
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
    try {
      await instructorService.deleteInstructor(id);
      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
      fetchMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = members
    .filter((member) => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'youtube': return Youtube;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-[400px] bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Team Management</CardTitle>
            <CardDescription>Manage your racing academy team members</CardDescription>
          </div>
          <Button 
            onClick={() => router.push("/admin/team-management/new")}
            className="bg-racing-red hover:bg-racing-red/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={member.imageUrl || ""} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            {member.name}
                            {member.featured && (
                              <Badge variant="outline" className="border-racing-red text-racing-red">
                                Featured
                              </Badge>
                            )}
                          </h3>
                          <p className="text-muted-foreground">{member.role}</p>
                        </div>
                        
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
                              onClick={() => router.push(`/admin/academy/instructor-management/${member.id}/edit`)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(member.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          {member.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 justify-end">
                          {Object.entries(member.socialMedia || {}).map(([platform, url]) => {
                            const Icon = getSocialIcon(platform);
                            if (Icon && url) {
                              return (
                                <Button
                                  key={platform}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  asChild
                                >
                                  <a href={url} target="_blank" rel="noopener noreferrer">
                                    <Icon className="h-4 w-4" />
                                  </a>
                                </Button>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>

                      {(member.experiences?.length > 0 || member.achievements?.length > 0) && (
                        <div className="pt-4 border-t space-y-3">
                          {member.experiences?.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Trophy className="h-4 w-4 text-racing-red" />
                              <span>{member.experiences[0].description}</span>
                            </div>
                          )}
                          {member.achievements?.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Medal className="h-4 w-4 text-racing-red" />
                              <span>{member.achievements[0].description}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">No team members found</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 