import React, { useState } from "react";
import { db } from "lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

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

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: courseData.description,
    onUpdate: ({ editor }) => {
      setCourseData(prev => ({
        ...prev,
        description: editor.getHTML()
      }));
    },
  });

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "courses"), courseData);
      alert("Course created successfully!");
      // Reset form
      setCourseData({
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
      editor?.commands.setContent("");
    } catch (error) {
      console.error("Error creating course: ", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
      <form onSubmit={handleCreateCourse} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Course Name</label>
          <input
            type="text"
            placeholder="Course Name"
            value={courseData.name}
            onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={courseData.date}
            onChange={(e) => setCourseData({ ...courseData, date: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration</label>
          <input
            type="text"
            placeholder="Duration (e.g., 2 days)"
            value={courseData.duration}
            onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age Range</label>
          <input
            type="text"
            placeholder="Age Range (e.g., 16-18)"
            value={courseData.ageRange}
            onChange={(e) => setCourseData({ ...courseData, ageRange: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            placeholder="Location"
            value={courseData.location}
            onChange={(e) => setCourseData({ ...courseData, location: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Available Spots</label>
          <input
            type="number"
            placeholder="Number of spots"
            value={courseData.spots}
            onChange={(e) => setCourseData({ ...courseData, spots: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <div className="prose prose-sm border rounded-lg overflow-hidden">
            <EditorContent editor={editor} className="min-h-[200px] p-4" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            placeholder="Image URL"
            value={courseData.image}
            onChange={(e) => setCourseData({ ...courseData, image: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={courseData.featured}
            onChange={(e) => setCourseData({ ...courseData, featured: e.target.checked })}
            className="mr-2"
          />
          <label className="text-sm font-medium">Featured Course</label>
        </div>
        <button
          type="submit"
          className="w-full bg-racing-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}
