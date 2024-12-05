"use client";

import { Course, CourseLevel } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { EnrollmentDialog } from "./enrollment-dialog";

interface CourseDetailsProps {
  initialCourse: Course;
}

export function CourseDetails({ initialCourse }: CourseDetailsProps) {
  const getLevelBadgeVariant = (level: CourseLevel) => {
    switch (level) {
      case "Beginner":
        return "default";
      case "Intermediate":
        return "secondary";
      case "Advanced":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Image and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            {initialCourse.imageUrl ? (
              <Image
                src={initialCourse.imageUrl}
                alt={initialCourse.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={getLevelBadgeVariant(initialCourse.level)}>
                {initialCourse.level}
              </Badge>
              {initialCourse.featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold">{initialCourse.title}</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-racing-red" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(initialCourse.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-racing-red" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {initialCourse.duration} days
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-racing-red" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {initialCourse.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-racing-red" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Available Spots</p>
                  <p className="text-sm text-muted-foreground">
                    {initialCourse.availableSpots}
                  </p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2>Course Description</h2>
              <div dangerouslySetInnerHTML={{ __html: initialCourse.longDescription }} />
            </div>
          </div>
        </div>

        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Course Fee</h3>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-racing-red" />
                    <span className="text-3xl font-bold">${initialCourse.price}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">What's Included:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Professional instruction
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Course materials
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Safety equipment
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Track time
                    </li>
                  </ul>
                </div>

                <EnrollmentDialog
                  course={initialCourse}
                  trigger={
                    <Button
                      className="w-full bg-racing-red hover:bg-racing-red/90"
                      size="lg"
                      disabled={initialCourse.availableSpots === 0}
                    >
                      {initialCourse.availableSpots === 0
                        ? "Course Full"
                        : "Enroll Now"}
                    </Button>
                  }
                />

                {initialCourse.availableSpots <= 5 && initialCourse.availableSpots > 0 && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    Only {initialCourse.availableSpots} spots remaining!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 