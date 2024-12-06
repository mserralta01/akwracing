import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { studentService } from "@/lib/services/student-service";
import { ParentProfile } from "@/types/student";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function ParentList() {
  const router = useRouter();
  const { toast } = useToast();
  const [parents, setParents] = useState<ParentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParent, setSelectedParent] = useState<ParentProfile | null>(null);

  const fetchParents = async () => {
    try {
      setLoading(true);
      // TODO: Implement pagination
      const allParents = await studentService.getAllParents();
      setParents(allParents);
    } catch (error) {
      console.error('Error fetching parents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch parents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const filteredParents = parents.filter(parent => {
    const searchString = `${parent.firstName} ${parent.lastName} ${parent.email}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parents</CardTitle>
        <CardDescription>Manage parent profiles and their students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => router.push("/admin/students/parents/new")}
              className="bg-racing-red hover:bg-racing-red/90"
            >
              Add Parent
            </Button>
          </div>

          {/* Parents Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell>
                      <div className="font-medium">
                        {parent.firstName} {parent.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {parent.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {parent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {parent.address.city}, {parent.address.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {parent.students.length} student(s)
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedParent(parent)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Parent Details</DialogTitle>
                              <DialogDescription>
                                View and manage parent information
                              </DialogDescription>
                            </DialogHeader>
                            {selectedParent && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <div className="mt-1">
                                      {selectedParent.firstName} {selectedParent.lastName}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Contact</Label>
                                    <div className="mt-1 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        {selectedParent.email}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        {selectedParent.phone}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label>Address</Label>
                                  <div className="mt-1 space-y-1">
                                    <div>
                                      {selectedParent.address.street}
                                    </div>
                                    <div>
                                      {selectedParent.address.city}, {selectedParent.address.state} {selectedParent.address.zipCode}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label>Students</Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedParent.students.map((studentId) => (
                                      <Button
                                        key={studentId}
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => router.push(`/admin/students/${studentId}`)}
                                      >
                                        <User className="h-4 w-4 mr-2" />
                                        View Student Profile
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => router.push(`/admin/students/parents/${parent.id}/edit`)}
                                  >
                                    Edit Profile
                                  </Button>
                                  <Button
                                    onClick={() => router.push(`/admin/students/parents/${parent.id}/enrollments`)}
                                  >
                                    View Enrollments
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 