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
import { EnrollmentFlow } from "@/components/enrollment/enrollment-flow";
import { motion } from "framer-motion";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CourseDetailsProps {
  initialCourse: Course;
}

export function CourseDetails({ initialCourse }: CourseDetailsProps) {
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  const handleEnrollmentComplete = () => {
    setIsEnrollmentOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date TBD';
    }
  };

  const getLevelBadgeVariant = (level: Course['level']) => {
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
    <div className="container mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Course Image and Basic Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            {initialCourse.imageUrl ? (
              <img
                src={initialCourse.imageUrl}
                alt={initialCourse.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{initialCourse.title}</h1>
            <div className="flex flex-wrap gap-4 mb-6">
              <Badge className={getLevelBadgeVariant(initialCourse.level)}>
                {initialCourse.level}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(initialCourse.startDate)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{initialCourse.location}</span>
              </div>
            </div>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: initialCourse.longDescription }}
            />
          </div>
        </div>

        {/* Enrollment Card */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-24"
          >
            <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Price</span>
                  <span className="text-2xl font-bold">${initialCourse.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Duration</span>
                  <span>{initialCourse.duration} days</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Available Spots</span>
                  <span>{initialCourse.availableSpots}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-racing-red" />
                  <span>Starts {formatDate(initialCourse.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-racing-red" />
                  <span>{initialCourse.availableSpots} spots remaining</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-racing-red" />
                  <span>Secure payment via NMI</span>
                </div>
              </div>

              <Dialog open={isEnrollmentOpen} onOpenChange={setIsEnrollmentOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-racing-red hover:bg-racing-red/90">
                    Enroll Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Course Enrollment</DialogTitle>
                    <DialogDescription>
                      Complete the enrollment process for {initialCourse.title}
                    </DialogDescription>
                  </DialogHeader>
                  <EnrollmentFlow 
                    course={initialCourse} 
                    onComplete={handleEnrollmentComplete} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 