"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Instructor } from "@/types/instructor";
import { Role } from "@/types/role";
import { instructorService } from "@/lib/services/instructor-service";
import { roleService } from "@/lib/services/role-service";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Pencil,
  Trash2,
  ExternalLink,
  User,
  Briefcase,
  Settings2,
  X
} from "lucide-react";

export default function TeamManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const [members, setMembers] = useState<Instructor[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersData, rolesData] = await Promise.all([
        instructorService.getInstructors(),
        roleService.getRoles()
      ]);
      setMembers(membersData.instructors);
      setRoles(rolesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
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
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const handleFeaturedToggle = async (member: Instructor, featured: boolean) => {
    try {
      await instructorService.updateInstructor(member.id, { ...member, featured });
      toast({
        title: "Success",
        description: `Team member ${featured ? 'featured' : 'unfeatured'} successfully`,
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      await roleService.createRole(newRoleName.trim());
      toast({
        title: "Success",
        description: "Role added successfully",
      });
      fetchData();
      setNewRoleName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add role",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !newRoleName.trim()) return;

    try {
      await roleService.updateRole(editingRole.id, newRoleName.trim());
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
      fetchData();
      setEditingRole(null);
      setNewRoleName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await roleService.deleteRole(roleId);
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const startEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
  };

  const cancelEdit = () => {
    setEditingRole(null);
    setNewRoleName("");
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
          <div className="flex items-center gap-3">
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Manage Roles
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Manage Team Roles</DialogTitle>
                  <DialogDescription>
                    Add, edit, or remove team roles. These roles can be assigned to team members.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Input
                      placeholder={editingRole ? "Update role name" : "Add new role"}
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                    {editingRole ? (
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleUpdateRole}
                          className="bg-racing-red hover:bg-racing-red/90"
                        >
                          Update
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleAddRole}
                        className="bg-racing-red hover:bg-racing-red/90"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                      >
                        <span>{role.name}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditRole(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this role? This will not affect team members currently assigned to this role.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteRole(role.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsRoleDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={() => router.push("/admin/team-management/new")}
              className="bg-racing-red hover:bg-racing-red/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
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
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={member.imageUrl || ""} alt={member.name} />
                      <AvatarFallback>
                        <User className="h-10 w-10 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            {member.name}
                            {member.featured && (
                              <Badge variant="outline" className="border-racing-red text-racing-red">
                                Featured
                              </Badge>
                            )}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm text-muted-foreground">Featured</span>
                            <Switch
                              checked={member.featured}
                              onCheckedChange={(checked) => handleFeaturedToggle(member, checked)}
                              className="data-[state=checked]:bg-racing-red"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/instructors/${member.id}`, '_blank')}
                            className="h-8 w-8"
                            title="View member page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/team-management/${member.id}/edit`)}
                            className="h-8 w-8"
                            title="Edit member"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                title="Delete member"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {member.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(member.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {member.role}
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {member.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
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