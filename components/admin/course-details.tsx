import { Course, CourseLevel } from "@/types/course";
import { Instructor } from "@/types/instructor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, DollarSign, User } from "lucide-react";
import Image from "next/image";

interface CourseDetailsProps {
  course: Course;
  instructors: Instructor[];
}

export function CourseDetails({ course, instructors }: CourseDetailsProps) {
  const instructor = instructors.find((i) => i.id === course.instructorId);

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl">{course.title}</CardTitle>
            <Badge className={getLevelBadgeVariant(course.level)}>
              {course.level}
            </Badge>
          </div>
          <div className="text-sm px-3 py-1 bg-muted rounded-full">
            {course.featured ? "Featured" : "Not Featured"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: course.longDescription }}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold">Course Details</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                    <div className="font-medium">{formatDate(course.startDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">{course.duration} days</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{course.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Available Spots</div>
                    <div className="font-medium">{course.availableSpots} / {course.maxStudents}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="font-medium text-lg">${course.price.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Instructor</div>
                    <div className="font-medium">{instructor ? instructor.name : "Not assigned"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 