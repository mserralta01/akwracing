"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StudentProfile } from "@/types/student";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const studentFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(10, "Valid phone number is required"),
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
    email: "",
    dateOfBirth: "",
    phone: "+1 ",
  };

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  const handleSubmit = (data: StudentFormData) => {
    // Remove formatting from phone number before submitting
    const formattedData: Omit<
      StudentProfile,
      "id" | "createdAt" | "updatedAt" | "parentId"
    > = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      phone: unformatPhoneNumber(data.phone),
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" disabled={loading} className="w-full">
          Continue
        </Button>
      </form>
    </Form>
  );
} 