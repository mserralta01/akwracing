"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StudentProfile } from "@/types/student";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const studentFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  experience: z
    .object({
      yearsOfExperience: z.number().min(0),
      previousCourses: z.array(z.string()).default([]),
      skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
    })
    .optional(),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  onSubmit: (data: Omit<StudentProfile, "id" | "createdAt" | "updatedAt" | "parentId">) => void;
  loading?: boolean;
  course: {
    title: string;
    startDate: string;
    endDate: string;
  };
}

const formatPhoneNumber = (value: string) => {
  if (!value) return "+1 ";
  
  // Remove all non-digits and any leading "1" if it exists
  let phoneNumber = value.replace(/[^\d]/g, '');
  if (phoneNumber.startsWith('1')) {
    phoneNumber = phoneNumber.slice(1);
  }
  
  // Format the number
  if (phoneNumber.length === 0) return "+1 ";
  if (phoneNumber.length <= 3) return `+1 (${phoneNumber}`;
  if (phoneNumber.length <= 6) return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const unformatPhoneNumber = (value: string) => {
  const digits = value.replace(/[^\d]/g, '');
  return digits.startsWith('1') ? digits.slice(1) : digits;
};

export function StudentForm({ onSubmit, loading, course }: StudentFormProps) {
  const defaultValues = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "+1 ",
    experience: {
      yearsOfExperience: 0,
      previousCourses: [],
      skillLevel: "Beginner" as const,
    },
  };

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  const handleSubmit = (data: StudentFormData) => {
    // Remove formatting from phone number before submitting
    const formattedData = {
      ...data,
      phone: unformatPhoneNumber(data.phone),
      experience: data.experience || {
        yearsOfExperience: 0,
        previousCourses: [],
        skillLevel: "Beginner",
      },
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{course.title}</h2>
          <p className="text-muted-foreground">
            {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={formatPhoneNumber(field.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const digits = value.replace(/[^\d]/g, '');
                    // Remove leading "1" if present and ensure max length of 10
                    const cleanDigits = digits.startsWith('1') ? digits.slice(1) : digits;
                    if (cleanDigits.length <= 10) {
                      field.onChange(cleanDigits);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      const input = e.target as HTMLInputElement;
                      const selectionStart = input.selectionStart || 0;
                      const value = field.value;
                      
                      // Prevent backspace if cursor is at or before "+1 "
                      if (selectionStart <= 3) {
                        e.preventDefault();
                        return;
                      }
                      
                      // Remove last digit
                      field.onChange(value.slice(0, -1));
                      e.preventDefault();
                    }
                  }}
                  placeholder="+1 (555) 123-4567"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="font-semibold">Experience</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="experience.yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience.skillLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  );
} 