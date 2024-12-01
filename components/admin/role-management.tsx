"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { Role, roleService } from "@/lib/services/role-service";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load roles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateRole = (role: string) => {
    if (role.length < 2) {
      return "Role name must be at least 2 characters";
    }
    if (role.length > 50) {
      return "Role name must be less than 50 characters";
    }
    return "";
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedRole = newRole.trim();
    
    // Clear previous error
    setRoleError("");
    
    // Validate
    const error = validateRole(trimmedRole);
    if (error) {
      setRoleError(error);
      return;
    }

    try {
      setIsLoading(true);
      await roleService.createRole(trimmedRole);
      setNewRole("");
      await fetchRoles();
      toast({
        title: "Success",
        description: "Role added successfully",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add role";
      setRoleError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    
    try {
      setIsLoading(true);
      await roleService.updateRole(id, editingName.trim());
      setEditingId(null);
      await fetchRoles();
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await roleService.deleteRole(id);
      setDeleteId(null);
      await fetchRoles();
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <Input
            placeholder="Add new role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !newRole.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </form>

        <div className="rounded-md border">
          {roles.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No roles found
            </div>
          ) : (
            roles.map((role) => (
              <div
                key={role.id}
                className="grid grid-cols-2 gap-4 p-4 border-b last:border-0 items-center"
              >
                {editingId === role.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleUpdate(role.id)}
                      disabled={isLoading}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdate(role.id)}
                      disabled={isLoading}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>{role.name}</div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(role.id);
                          setEditingName(role.name);
                        }}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(role.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 