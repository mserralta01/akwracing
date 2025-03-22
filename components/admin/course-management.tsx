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
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useLoadingState } from "@/hooks/use-loading-state";

export default function CourseManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<CourseLevel | "all">("all");
  
  const { handleError } = useErrorHandler();
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const fetchCourses = async () => {
    try {
      startLoading("Loading courses...");
      const { courses } = await courseService.getCourses();
      setCourses(courses);
    } catch (error) {
      handleError(error, {
        logToConsole: true,
        throwError: false,
      });
    } finally {
      stopLoading();
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
      startLoading("Deleting course...");
      await courseService.deleteCourse(course.id);
      await fetchCourses();
      toast({
        title: "Success",
        description: "Course deleted successfully",
        variant: "default",
      });
    } catch (error) {
      handleError(error);
    } finally {
      stopLoading();
    }
  };

  const handleFeatureToggle = async (course: Course, checked: boolean) => {
    try {
      startLoading(checked ? "Featuring course..." : "Unfeaturing course...");
      await courseService.updateCourse(course.id, { featured: checked });
      setCourses(courses.map(c => 
        c.id === course.id ? { ...c, featured: checked } : c
      ));
      toast({
        title: "Success",
        description: `Course ${checked ? "featured" : "unfeatured"} successfully`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      stopLoading();
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
    <ErrorBoundary>
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

            {isLoading ? (
              <div className="space-y-4">
                <SkeletonLoader variant="card" count={3} />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="hover:bg-muted/50 transition-colors border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="relative w-[180px] h-[120px] rounded-lg overflow-hidden flex-shrink-0">
                          <OptimizedImage
                            src={course.imageUrl || "/placeholder-course.jpg"}
                            alt={course.title}
                            width={180}
                            height={120}
                            className="object-cover w-full h-full"
                            fallbackSrc="/placeholder-course.jpg"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                              <div className="mb-4">
                                <Badge className={getLevelBadgeVariant(course.level)}>
                                  {course.level}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center">
                                <span className="text-sm text-muted-foreground mb-1">
                                  Featured
                                </span>
                                <Switch
                                  checked={course.featured}
                                  onCheckedChange={(checked) => handleFeatureToggle(course, checked)}
                                  className="data-[state=checked]:bg-racing-red"
                                  disabled={isLoading}
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`/courses/${course.slug}`, "_blank")}
                                  className="h-8 px-3"
                                  title="View course"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(course.slug)}
                                  className="h-8 px-3"
                                  title="Edit course"
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                      title="Delete course"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this course? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(course)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                          <div className="mt-auto">
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {new Date(course.startDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {course.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{course.availableSpots}</span> spots
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="font-bold text-foreground">${course.price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No courses found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

