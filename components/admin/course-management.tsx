"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course, CourseLevel } from "@/types/course";
import { courseService } from "@/lib/services/course-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
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
  Users,
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
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

export default function CourseManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<CourseLevel | "all">("all");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { courses } = await courseService.getCourses();
      setCourses(courses);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (courseName: string) => {
    router.push(`/admin/academy/course-management/${courseName}/edit`);
  };

  const handleDelete = async (course: Course) => {
    try {
      await courseService.deleteCourse(course.id);
      await fetchCourses();
      toast({
        title: "Success",
        description: "Course deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCourses = courses
    .filter((course) => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterLevel === "all" || course.level === filterLevel)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getLevelBadgeVariant = (level: CourseLevel) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      case "Intermediate":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "Advanced":
        return "bg-racing-red/10 text-racing-red hover:bg-racing-red/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div />
          <Button 
            onClick={() => router.push("/admin/academy/course-management/new")}
            className="bg-racing-red hover:bg-racing-red/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLevel} onValueChange={(value: CourseLevel | "all") => setFilterLevel(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="relative w-[180px] h-[100px] rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={course.imageUrl || '/placeholder-course.jpg'}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="180px"
                      />
                    </div>
                    <div className="flex flex-1 items-start justify-between">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold">{course.title}</h3>
                          <p 
                            className="text-sm text-muted-foreground line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: course.shortDescription }}
                          />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(course.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {course.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.availableSpots} spots
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${course.price.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getLevelBadgeVariant(course.level)}>
                          {course.level}
                        </Badge>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm text-muted-foreground">
                            Featured
                          </span>
                          <Switch
                            checked={course.featured}
                            onCheckedChange={async (checked) => {
                              try {
                                await courseService.updateCourse(course.id, { featured: checked });
                                setCourses(courses.map(c => 
                                  c.id === course.id ? { ...c, featured: checked } : c
                                ));
                                toast({
                                  title: "Success",
                                  description: `Course ${checked ? 'featured' : 'unfeatured'} successfully`,
                                });
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to update course featured status",
                                  variant: "destructive",
                                });
                              }
                            }}
                            className="data-[state=checked]:bg-racing-red"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/courses/${course.slug}`, '_blank')}
                            className="h-8 w-8"
                            title="View course"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(course.slug)}
                            className="h-8 w-8"
                            title="Edit course"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                title="Delete course"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the course
                                  "{course.title}" and remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDelete(course)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">No courses found</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
