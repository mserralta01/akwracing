"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";

interface CourseDetailsProps {
  initialCourse: Course | null;
}

export function CourseDetails({ initialCourse }: CourseDetailsProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-500 text-white hover:bg-emerald-600";
      case "Intermediate":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "Advanced":
        return "bg-racing-red text-white hover:bg-red-700";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  if (!initialCourse) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Course not found or has been removed.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "MMMM d, yyyy");
    } catch {
      return "Date TBD";
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Section */}
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={initialCourse.imageUrl || "/placeholder-course.jpg"}
              alt={initialCourse.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Badge 
              className={`absolute top-4 left-4 ${getLevelBadgeVariant(initialCourse.level)}`}
            >
              {initialCourse.level}
            </Badge>
          </div>

          {/* Course Info Section */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{initialCourse.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">
                {initialCourse.shortDescription}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-racing-red" />
                  <span>{formatDate(initialCourse.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-racing-red" />
                  <span>{initialCourse.duration} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-racing-red" />
                  <span>{initialCourse.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-racing-red" />
                  <span>{initialCourse.availableSpots} spots remaining</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-racing-red" />
                  <div>
                    <p className="text-sm text-muted-foreground">Course Price</p>
                    <p className="text-3xl font-bold">${initialCourse.price.toLocaleString()}</p>
                  </div>
                </div>
                <Button 
                  size="lg"
                  className="bg-racing-red hover:bg-red-700 text-white px-8"
                  onClick={() => setIsEnrolling(true)}
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Course Details</h2>
              <div className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ 
                  __html: initialCourse.longDescription 
                }}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">What You'll Get</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-racing-red mt-0.5" />
                  <span>Professional racing instruction</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-racing-red mt-0.5" />
                  <span>Access to premium racing facilities</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-racing-red mt-0.5" />
                  <span>Safety equipment and gear</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-racing-red mt-0.5" />
                  <span>Course completion certificate</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Limited Availability</h3>
              <p className="text-muted-foreground mb-4">
                Only {initialCourse.availableSpots} spots remaining for this course.
                Secure your place today!
              </p>
              <Button 
                className="w-full bg-racing-red hover:bg-red-700 text-white"
                onClick={() => setIsEnrolling(true)}
              >
                Reserve Your Spot
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 