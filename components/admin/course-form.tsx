"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course, CourseLevel } from "@/types/course";
import { Equipment } from "@/types/equipment";
import { courseService } from "@/lib/services/course-service";
import { equipmentService } from "@/lib/services/equipment-service";
import { useToast } from "@/components/ui/use-toast";
import { parseISO, format, isValid, differenceInDays, addDays } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeatures } from "@/contexts/features-context";
import { Instructor } from "@/types/instructor";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  price: z.number().min(0, "Price must be positive"),
  duration: z.number().min(1, "Duration must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxStudents: z.number().min(1, "Maximum students must be at least 1"),
  availableSpots: z.number().min(0, "Available spots cannot be negative"),
  imageUrl: z.string().optional(),
  instructorId: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  featured: z.boolean().default(false),
  providedEquipment: z.array(z.string()).optional().default([]),
  requiredEquipment: z.array(z.string()).optional().default([]),
});

type FormData = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialData?: Course;
  instructors?: Instructor[];
}

const CourseForm = ({ initialData, instructors }: CourseFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      shortDescription: "",
      longDescription: "",
      level: "Beginner",
      price: 0,
      duration: 1,
      startDate: "",
      endDate: "",
      maxStudents: 1,
      availableSpots: 0,
      location: "",
      featured: false,
      providedEquipment: [],
      requiredEquipment: [],
    },
  });

  // ... rest of component implementation ...

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add other form fields here */}
      </div>
    </Form>
  );
};

export { CourseForm };
