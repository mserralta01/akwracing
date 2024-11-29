import React, { useState } from "react";
import { db } from "lib/firebase";
import { collection, addDoc } from "firebase/firestore";
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

type NewCourse = {
  title: string;
  briefDescription: string;
  location: string;
  description: string;
  price: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  ageRange: string;
  photo: File | null;
  spots: number;
};

export function AddCourse() {
  const [newCourse, setNewCourse] = useState<NewCourse>({
    title: "",
    briefDescription: "",
    location: "",
    description: "",
    price: "",
    duration: "",
    level: "Beginner",
    ageRange: "",
    photo: null,
    spots: 0,
  });

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "courses"), newCourse);
      // Reset form or navigate back to course management
    } catch (error) {
      console.error("Error adding course: ", error);
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
          placeholder="Brief Description"
          value={newCourse.briefDescription}
          onChange={(e) => setNewCourse({ ...newCourse, briefDescription: e.target.value })}
          required
        />
        <Input
          placeholder="Location"
          value={newCourse.location}
          onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
          required
        />
        <Textarea
          placeholder="Course Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          value={newCourse.price}
          onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Duration (days)"
          value={newCourse.duration}
          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
          required
        />
        <Select
          value={newCourse.level}
          onValueChange={(value) => setNewCourse({ ...newCourse, level: value as NewCourse["level"] })}
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
        <Input
          placeholder="Age Range"
          value={newCourse.ageRange}
          onChange={(e) => setNewCourse({ ...newCourse, ageRange: e.target.value })}
          required
        />
        <FileUpload
          onFileSelect={(file: File | null) => setNewCourse({ ...newCourse, photo: file })}
        />
        <Input
          type="number"
          placeholder="Available Spots"
          value={newCourse.spots}
          onChange={(e) => setNewCourse({ ...newCourse, spots: parseInt(e.target.value) })}
          required
        />
        <Button type="submit" className="w-full bg-racing-red hover:bg-red-700">
          Add Course
        </Button>
      </form>
    </div>
  );
} 