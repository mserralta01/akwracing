"use client";

import React, { useState, useEffect } from "react";
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
import { NewCourse, CourseLevel } from "@/types/course";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor } from "@/types/instructor";

export function AddCourse() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState<NewCourse>({
    title: "",
    shortDescription: "",
    longDescription: "",
    description: "",
    content: "",
    location: "",
    price: 0,
    duration: 1,
    level: "Beginner",
    startDate: "",
    endDate: "",
    photo: undefined,
    maxStudents: 0,
    availableSpots: 0,
    featured: false,
    instructorId: "",
    status: "draft",
    imageUrl: "",
    equipmentRequirements: [],
    providedEquipment: [],
    requiredEquipment: [],
  });
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { instructors } = await instructorService.getInstructors();
        setInstructors(instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { photo, ...courseData } = newCourse;
      const result = await courseService.createCourse({
        ...courseData,
        imageUrl: "",
      }, photo);

      if (!result.id) {
        toast({
          title: "Error",
          description: "Failed to create course",
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
        <Textarea
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          required
        />
        <Textarea
          placeholder="Content"
          value={newCourse.content}
          onChange={(e) => setNewCourse({ ...newCourse, content: e.target.value })}
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
          onFileSelect={(file: File | undefined) => setNewCourse({ ...newCourse, photo: file })}
        />
        <Input
          type="number"
          placeholder="Maximum Students"
          value={newCourse.maxStudents.toString()}
          onChange={(e) => setNewCourse({ ...newCourse, maxStudents: Number(e.target.value) || 0 })}
          required
          min="0"
        />
        <Input
          type="number"
          placeholder="Available Spots"
          value={newCourse.availableSpots.toString()}
          onChange={(e) => setNewCourse({ ...newCourse, availableSpots: Number(e.target.value) || 0 })}
          required
          min="0"
        />
        <Select
          value={newCourse.instructorId}
          onValueChange={(value) => setNewCourse({ ...newCourse, instructorId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Instructor" />
          </SelectTrigger>
          <SelectContent>
            {instructors.map((instructor) => (
              <SelectItem key={instructor.id} value={instructor.id}>
                {instructor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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