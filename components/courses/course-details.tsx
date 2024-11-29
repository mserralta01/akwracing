"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { courseService } from "@/lib/services/course-service";

interface CourseDetailsProps {
  initialCourse: Course | null;
}

export function CourseDetails({ initialCourse }: CourseDetailsProps) {
  if (!initialCourse) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Course not found or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-2">{initialCourse.title}</CardTitle>
              <p className="text-muted-foreground">{initialCourse.shortDescription}</p>
            </div>
            <Badge variant="secondary">{initialCourse.level}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Course Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    {initialCourse.duration} days
                  </p>
                  <p>
                    <span className="text-muted-foreground">Location:</span>{" "}
                    {initialCourse.location}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Available Spots:</span>{" "}
                    {initialCourse.availableSpots}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Price:</span> $
                    {initialCourse.price}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dates</h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-muted-foreground">Start Date:</span>{" "}
                    {format(new Date(initialCourse.startDate), "PPP")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">End Date:</span>{" "}
                    {format(new Date(initialCourse.endDate), "PPP")}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Course Description</h3>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: initialCourse.longDescription }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 