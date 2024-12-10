import { Course } from "@/types/course";
import { Instructor } from "@/types/instructor";

interface CourseDetailsProps {
  course: Course;
  instructors: Instructor[];
}

export function CourseDetails({ course, instructors }: CourseDetailsProps) {
  const instructor = instructors.find((i) => i.id === course.instructorId);

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-2">{course.title}</h2>
      <p className="text-gray-700 mb-4">{course.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Start Date:</h3>
          <p>{new Date(course.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <h3 className="font-semibold">End Date:</h3>
          <p>{new Date(course.endDate).toLocaleDateString()}</p>
        </div>
        <div>
          <h3 className="font-semibold">Instructor:</h3>
          <p>{instructor ? instructor.name : "Not assigned"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Available Spots:</h3>
          <p>{course.availableSpots}</p>
        </div>
        <div>
          <h3 className="font-semibold">Location:</h3>
          <p>{course.location}</p>
        </div>
      </div>
    </div>
  );
} 