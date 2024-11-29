"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Instructor, Language, SocialMedia } from "@/types/instructor";
import { instructorService } from "@/lib/services/instructor-service";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

const languageLevelEnum = z.enum(['Basic', 'Intermediate', 'Fluent', 'Native']);

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  experience: z.string().min(1, "Experience is required"),
  achievements: z.array(z.string()),
  languages: z.array(z.object({
    language: z.string(),
    level: languageLevelEnum
  })),
  featured: z.boolean().default(false),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional()
  }).default({}),
  imageUrl: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

type InstructorFormProps = {
  initialData?: Instructor;
  isEditing?: boolean;
};

export function InstructorForm({ initialData, isEditing = false }: InstructorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newAchievement, setNewAchievement] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      role: initialData?.role ?? "",
      experience: initialData?.experience ?? "",
      achievements: initialData?.achievements ?? [],
      languages: initialData?.languages ?? [],
      featured: initialData?.featured ?? false,
      socialMedia: initialData?.socialMedia ?? {
        instagram: "",
        facebook: "",
        linkedin: "",
        twitter: ""
      },
      imageUrl: initialData?.imageUrl
    },
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      const currentAchievements = form.getValues("achievements");
      form.setValue("achievements", [...currentAchievements, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = form.getValues("achievements");
    form.setValue("achievements", currentAchievements.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      if (isEditing && initialData) {
        await instructorService.updateInstructor(initialData.id, {
          ...values,
          socialMedia: values.socialMedia || {},
        }, imageFile);
        toast({
          title: "Success",
          description: "Instructor updated successfully",
        });
      } else {
        await instructorService.createInstructor({
          ...values,
          socialMedia: values.socialMedia || {},
        }, imageFile);
        toast({
          title: "Success",
          description: "Instructor created successfully",
        });
      }
      
      router.push("/admin/academy/instructor-management");
      router.refresh();
    } catch (error) {
      console.error("Error submitting instructor form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Instructor' : 'Create Instructor'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Instructor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Instructor role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the instructor's experience"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Achievements</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add an achievement"
                    />
                    <Button type="button" onClick={addAchievement}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.watch("achievements").map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span>{achievement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Instructor</FormLabel>
                        <FormDescription>
                          Display this instructor on the homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Profile Image</FormLabel>
                  <FileUpload onFileSelect={handleImageChange} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/academy/instructor-management")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </div>
                ) : isEditing ? (
                  "Update Instructor"
                ) : (
                  "Create Instructor"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 