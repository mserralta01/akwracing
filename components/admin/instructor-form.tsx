"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Instructor, RacingIcon, InstructorFormData } from "@/types/instructor";
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
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { RacingIconSelector } from "@/components/ui/racing-icon-selector";
import { icons } from "@/lib/constants/icons";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  experiences: z.array(z.object({
    description: z.string(),
    icon: z.enum(['Trophy', 'Flag', 'Medal', 'Star', 'Crown', 'Certificate', 
      'Timer', 'Car', 'Tools', 'Users', 'Target', 'Chart', 'Award']),
    year: z.string()
  })),
  achievements: z.array(z.object({
    description: z.string(),
    icon: z.enum(['Trophy', 'Flag', 'Medal', 'Star', 'Crown', 'Certificate', 
      'Timer', 'Car', 'Tools', 'Users', 'Target', 'Chart', 'Award']),
    year: z.string()
  })),
  languages: z.array(z.object({
    language: z.string(),
    level: z.enum(['Basic', 'Intermediate', 'Fluent', 'Native'])
  })),
  featured: z.boolean().default(false),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional()
  }).default({}),
  imageUrl: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

type InstructorFormProps = {
  initialData?: Instructor;
  isEditing?: boolean;
};

interface ExperienceEntry {
  description: string;
  icon: RacingIcon;
  year: string;
}

interface AchievementEntry {
  description: string;
  icon: RacingIcon;
  year: string;
}

export function InstructorForm({ initialData, isEditing = false }: InstructorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newExperience, setNewExperience] = useState<ExperienceEntry>({
    description: "",
    icon: "Trophy",
    year: new Date().getFullYear().toString()
  });
  const [newAchievement, setNewAchievement] = useState<AchievementEntry>({
    description: "",
    icon: "Trophy",
    year: new Date().getFullYear().toString()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      role: "",
      experiences: [],
      achievements: [],
      languages: [],
      featured: false,
      socialMedia: {
        instagram: "",
        facebook: "",
        linkedin: "",
        twitter: "",
        youtube: "",
      },
    },
  });

  const addExperience = () => {
    if (newExperience.description.trim()) {
      const currentExperiences = form.getValues("experiences") || [];
      form.setValue("experiences", [...currentExperiences, { ...newExperience }]);
      setNewExperience({
        description: "",
        icon: "Trophy",
        year: new Date().getFullYear().toString()
      });
    }
  };

  const removeExperience = (index: number) => {
    const currentExperiences = form.getValues("experiences") || [];
    form.setValue("experiences", currentExperiences.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    if (newAchievement.description.trim()) {
      const currentAchievements = form.getValues("achievements") || [];
      form.setValue("achievements", [...currentAchievements, { ...newAchievement }]);
      setNewAchievement({
        description: "",
        icon: "Trophy",
        year: new Date().getFullYear().toString()
      });
    }
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = form.getValues("achievements") || [];
    form.setValue("achievements", currentAchievements.filter((_, i) => i !== index));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const formData: InstructorFormData = {
        ...values,
        imageUrl: values.imageUrl || '', // Ensure imageUrl is always a string
        experiences: values.experiences || [],
        achievements: values.achievements || [],
        languages: values.languages || [],
        socialMedia: values.socialMedia || {},
      };

      if (isEditing && initialData) {
        await instructorService.updateInstructor(initialData.id, formData, imageFile);
        toast({
          title: "Success",
          description: "Instructor updated successfully",
        });
      } else {
        await instructorService.createInstructor(formData, imageFile);
        toast({
          title: "Success",
          description: "Instructor created successfully",
        });
      }
      router.push("/admin/academy/instructor-management");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
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

                <div className="space-y-4">
                  <FormLabel>Experience</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                      placeholder="Add experience"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={newExperience.year}
                      onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })}
                      placeholder="Year"
                      className="w-24"
                    />
                    <RacingIconSelector
                      value={newExperience.icon}
                      onChange={(icon) => setNewExperience({ ...newExperience, icon: icon as RacingIcon })}
                    />
                    <Button type="button" onClick={addExperience}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(form.watch("experiences") || []).map((experience, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md">
                        {icons[experience.icon as RacingIcon] && (
                          <div className="h-4 w-4 text-racing-red">
                            {React.createElement(icons[experience.icon as RacingIcon])}
                          </div>
                        )}
                        <span className="flex-1">{experience.description}</span>
                        <span className="text-sm text-muted-foreground">{experience.year}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <FormLabel>Achievements</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                      placeholder="Add an achievement"
                    />
                    <Input
                      type="number"
                      value={newAchievement.year}
                      onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                      placeholder="Year"
                      className="w-24"
                    />
                    <RacingIconSelector
                      value={newAchievement.icon}
                      onChange={(icon) => setNewAchievement({ ...newAchievement, icon: icon as RacingIcon })}
                    />
                    <Button type="button" onClick={addAchievement}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(form.watch("achievements") || []).map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md">
                        {icons[achievement.icon as RacingIcon] && (
                          <div className="h-4 w-4 text-racing-red">
                            {React.createElement(icons[achievement.icon as RacingIcon])}
                          </div>
                        )}
                        <span className="flex-1">{achievement.description}</span>
                        <span className="text-sm text-muted-foreground">{achievement.year}</span>
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