import React, { useState, useRef, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function CourseManagement() {
  const [courseData, setCourseData] = useState({
    name: "",
    date: "",
    duration: "",
    ageRange: "",
    location: "",
    spots: 0,
    description: "",
    image: "",
    featured: false,
  });

  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if (quillRef.current) {
      // Access the editor instance directly
      const editor = quillRef.current.getEditor();
      // Perform any necessary operations with the editor
    }
  }, []);

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "courses"), courseData);
      alert("Course created successfully!");
    } catch (error) {
      console.error("Error creating course: ", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
      <form onSubmit={handleCreateCourse}>
        <input
          type="text"
          placeholder="Course Name"
          value={courseData.name}
          onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
          required
        />
        {/* Add other fields for date, duration, etc. */}
        <ReactQuill
          ref={quillRef}
          value={courseData.description}
          onChange={(value) => setCourseData({ ...courseData, description: value })}
        />
        <button type="submit" className="bg-racing-red hover:bg-red-700">
          Create Course
        </button>
      </form>
    </div>
  );
} 