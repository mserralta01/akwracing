"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Instructor, RacingIcon } from "@/types/instructor";
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
import { ImageUpload } from "@/components/image-upload";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RacingIconSelector } from "@/components/ui/racing-icon-selector";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Trophy, 
  Medal,
  Calendar,
  Plus,
  X,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube
} from "lucide-react";
import { roleService } from "@/lib/services/role-service";
import type { Role } from "../../types/role";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@/components/ui/editor";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  level: z.enum(["Junior", "Senior", "Master"]),
  experiences: z.array(
    z.object({
      description: z.string(),
      icon: z.enum([
        'Trophy', 'Flag', 'Medal', 'Star', 'Crown', 'Certificate', 
        'Timer', 'Car', 'Tools', 'Users', 'Target', 'Chart', 'Award'
      ] as const),
      year: z.string(),
    })
  ),
  achievements: z.array(
    z.object({
      description: z.string(),
      icon: z.enum([
        'Trophy', 'Flag', 'Medal', 'Star', 'Crown', 'Certificate', 
        'Timer', 'Car', 'Tools', 'Users', 'Target', 'Chart', 'Award'
      ] as const),
      year: z.string(),
    })
  ),
  languages: z.array(z.string()),
  featured: z.boolean(),
  socialMedia: z.object({
    instagram: z.string().optional().nullable(),
    facebook: z.string().optional().nullable(),
    linkedin: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
    youtube: z.string().optional().nullable(),
  }).optional().default({}),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  imageUrl: z.string(),
});

type TeamFormProps = {
  initialData?: Instructor;
  isEditing?: boolean;
};

export function TeamForm({ initialData, isEditing = false }: TeamFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialData?.imageUrl || undefined
  );
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await roleService.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      role: "",
      bio: "",
      level: "Junior",
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
      imageUrl: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const cleanedSocialMedia = Object.fromEntries(
        Object.entries(values.socialMedia || {})
          .filter(([_, value]) => value != null && value !== '')
          .map(([key, value]) => [key, value || undefined])
      );

      const cleanedData = {
        ...values,
        bio: values.bio,
        level: values.level,
        socialMedia: cleanedSocialMedia,
        phone: values.phone || undefined,
        email: values.email || undefined,
        imageUrl: values.imageUrl || "",
      };

      if (isEditing && initialData) {
        await instructorService.updateInstructor(initialData.id, cleanedData, selectedImage);
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
      } else {
        await instructorService.createInstructor(cleanedData, selectedImage);
        toast({
          title: "Success",
          description: "Team member created successfully",
        });
      }
      router.push("/admin/team-management");
      router.refresh();
    } catch (error) {
      console.error("Error saving team member:", error);
      toast({
        title: "Error",
        description: "Failed to save team member",
        variant: "destructive",
      });
    }
  };

  const [newExperience, setNewExperience] = useState({
    description: "",
    icon: "Trophy" as RacingIcon,
    year: new Date().getFullYear().toString(),
  });

  const [newAchievement, setNewAchievement] = useState({
    description: "",
    icon: "Medal" as RacingIcon,
    year: new Date().getFullYear().toString(),
  });

  const addExperience = () => {
    if (newExperience.description) {
      const currentExperiences = form.getValues("experiences");
      form.setValue("experiences", [...currentExperiences, newExperience]);
      setNewExperience({
        description: "",
        icon: "Trophy",
        year: new Date().getFullYear().toString(),
      });
    }
  };

  const addAchievement = () => {
    if (newAchievement.description) {
      const currentAchievements = form.getValues("achievements");
      form.setValue("achievements", [...currentAchievements, newAchievement]);
      setNewAchievement({
        description: "",
        icon: "Medal",
        year: new Date().getFullYear().toString(),
      });
    }
  };

  const removeExperience = (index: number) => {
    const currentExperiences = form.getValues("experiences");
    form.setValue(
      "experiences",
      currentExperiences.filter((_, i) => i !== index)
    );
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = form.getValues("achievements");
    form.setValue(
      "achievements",
      currentAchievements.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-racing-red" />
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>
                <Separator />
                
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Editor
                            content={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Master">Master</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              {...field}
                              value={field.value || ""}
                            />
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
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+1 234 567 8900" 
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Image */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-racing-red" />
                  <h2 className="text-xl font-semibold">Profile Image</h2>
                </div>
                <Separator />
                <div className="aspect-square relative rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <ImageUpload
                    value={previewUrl}
                    onChange={(file) => {
                      setSelectedImage(file);
                      if (file) {
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experiences & Achievements */}
          <Card className="lg:col-span-3 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Experiences Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Trophy className="h-5 w-5 text-racing-red" />
                    <h2 className="text-xl font-semibold">Racing Experience</h2>
                  </div>
                  <Separator className="mb-4" />

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Input
                        placeholder="Experience description"
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({ 
                          ...newExperience, 
                          description: e.target.value 
                        })}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Year"
                        value={newExperience.year}
                        onChange={(e) => setNewExperience({ 
                          ...newExperience, 
                          year: e.target.value 
                        })}
                        className="w-24"
                      />
                      <RacingIconSelector
                        value={newExperience.icon}
                        onChange={(icon) => setNewExperience({ 
                          ...newExperience, 
                          icon: icon as RacingIcon 
                        })}
                      />
                      <Button 
                        type="button" 
                        onClick={addExperience}
                        className="bg-racing-red hover:bg-racing-red/90"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {form.watch("experiences")?.map((experience, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg"
                        >
                          <Trophy className="h-4 w-4 text-racing-red flex-shrink-0" />
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
                </div>

                {/* Achievements Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Medal className="h-5 w-5 text-racing-red" />
                    <h2 className="text-xl font-semibold">Achievements</h2>
                  </div>
                  <Separator className="mb-4" />

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Input
                        placeholder="Achievement description"
                        value={newAchievement.description}
                        onChange={(e) => setNewAchievement({ 
                          ...newAchievement, 
                          description: e.target.value 
                        })}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Year"
                        value={newAchievement.year}
                        onChange={(e) => setNewAchievement({ 
                          ...newAchievement, 
                          year: e.target.value 
                        })}
                        className="w-24"
                      />
                      <RacingIconSelector
                        value={newAchievement.icon}
                        onChange={(icon) => setNewAchievement({ 
                          ...newAchievement, 
                          icon: icon as RacingIcon 
                        })}
                      />
                      <Button 
                        type="button" 
                        onClick={addAchievement}
                        className="bg-racing-red hover:bg-racing-red/90"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {form.watch("achievements")?.map((achievement, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg"
                        >
                          <Medal className="h-4 w-4 text-racing-red flex-shrink-0" />
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="lg:col-span-3 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-racing-red" />
                  <h2 className="text-xl font-semibold">Social Media</h2>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="socialMedia.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Instagram profile URL" 
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMedia.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Facebook profile URL" 
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMedia.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="LinkedIn profile URL" 
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMedia.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Twitter profile URL" 
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Toggle & Actions */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Team Member</FormLabel>
                      <FormDescription>
                        Display this team member on the homepage
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

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/team-management")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-racing-red hover:bg-racing-red/90"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </div>
                  ) : isEditing ? (
                    "Update Team Member"
                  ) : (
                    "Create Team Member"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
} 