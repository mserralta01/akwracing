"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { courseService } from "@/lib/services/course-service";
import { useToast } from "@/components/ui/use-toast";
import { CourseFormData, CourseLevel } from "@/types/course";

type NewCourse = Omit<CourseFormData, 'imageUrl'> & {
  photo: File | null;
};

export function AddCourse() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState<NewCourse>({
    title: "",
    shortDescription: "",
    location: "",
    longDescription: "",
    price: 0,
    duration: 1,
    level: "Beginner",
    startDate: "",
    endDate: "",
    photo: null,
    availableSpots: 0,
    featured: false,
  });

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseFormData: CourseFormData = {
        ...newCourse,
        imageUrl: null,
      };

      delete (courseFormData as any).photo;

      const result = await courseService.createCourse(courseFormData, newCourse.photo);

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to create course",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      router.push("/admin/academy/course-management");
      router.refresh();
    } catch (error) {
      console.error("Error adding course: ", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleAddCourse} className="space-y-4">
        <Input
          placeholder="Course Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          required
        />
        <Input
          placeholder="Short Description"
          value={newCourse.shortDescription}
          onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
          required
        />
        <Input
          placeholder="Location"
          value={newCourse.location}
          onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
          required
        />
        <Textarea
          placeholder="Long Description"
          value={newCourse.longDescription}
          onChange={(e) => setNewCourse({ ...newCourse, longDescription: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          value={newCourse.price.toString()}
          onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) || 0 })}
          required
          min="0"
        />
        <Input
          type="number"
          placeholder="Duration (days)"
          value={newCourse.duration.toString()}
          onChange={(e) => setNewCourse({ ...newCourse, duration: Number(e.target.value) || 1 })}
          required
          min="1"
        />
        <Input
          type="date"
          placeholder="Start Date"
          value={newCourse.startDate}
          onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
          required
        />
        <Input
          type="date"
          placeholder="End Date"
          value={newCourse.endDate}
          onChange={(e) => setNewCourse({ ...newCourse, endDate: e.target.value })}
          required
        />
        <Select
          value={newCourse.level}
          onValueChange={(value: CourseLevel) => setNewCourse({ ...newCourse, level: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <FileUpload
          onFileSelect={(file: File | null) => setNewCourse({ ...newCourse, photo: file })}
        />
        <Input
          type="number"
          placeholder="Available Spots"
          value={newCourse.availableSpots.toString()}
          onChange={(e) => setNewCourse({ ...newCourse, availableSpots: Number(e.target.value) || 0 })}
          required
          min="0"
        />
        <Button 
          type="submit" 
          className="w-full bg-racing-red hover:bg-red-700"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating...
            </div>
          ) : (
            "Add Course"
          )}
        </Button>
      </form>
    </div>
  );
} 