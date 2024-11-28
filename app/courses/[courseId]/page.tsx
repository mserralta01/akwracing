"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { courseService } from "@/lib/services/course-service";
import { Course } from "@/types/course";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  GraduationCap,
} from "lucide-react";

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch course details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, toast]);

  const handleRegister = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (!course) return;

    try {
      setRegistering(true);
      await courseService.registerForCourse(course.id, user.uid, {
        name: user.displayName || "",
        email: user.email || "",
      });
      toast({
        title: "Success",
        description: "Successfully registered for the course",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for the course",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="aspect-video bg-muted rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Course Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The course you are looking for does not exist or has been removed.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/courses")}
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <Badge variant="secondary" className="mb-4">
              {course.level}
            </Badge>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: course.longDescription }} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6 space-y-6">
              <div className="text-3xl font-bold">${course.price}</div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Dates</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(course.startDate), "PPP")} -{" "}
                      {format(new Date(course.endDate), "PPP")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div className="text-sm text-muted-foreground">
                      {course.duration} days
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {course.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Available Spots</div>
                    <div className="text-sm text-muted-foreground">
                      {course.availableSpots} remaining
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Level</div>
                    <div className="text-sm text-muted-foreground">
                      {course.level}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleRegister}
                disabled={registering || course.availableSpots === 0}
              >
                {registering
                  ? "Processing..."
                  : course.availableSpots === 0
                  ? "Sold Out"
                  : "Register Now"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
            <DialogDescription>
              Please sign in to register for this course.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLoginDialog(false);
                router.push("/sign-in");
              }}
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
