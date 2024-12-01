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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { instructorService } from "@/lib/services/instructor-service";
import { Instructor, RacingIcon } from "@/types/instructor";
import { useToast } from "@/components/ui/use-toast";
import {
  Trophy,
  Flag,
  Medal,
  Star,
  Crown,
  ScrollText,
  Timer,
  Car,
  Wrench,
  Users,
  Target,
  BarChart2,
  Award,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, roleService } from "@/lib/services/role-service";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
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
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
  }),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  imageUrl: z.string(),
});

type TeamFormProps = {
  initialData?: Instructor;
  isEditing?: boolean;
};

export function TeamForm({ initialData, isEditing = false }: TeamFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const fetchedRoles = await roleService.getRoles();
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast({
          title: "Error",
          description: "Failed to load roles",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [toast]);

  const defaultValues = {
    name: initialData?.name ?? "",
    role: initialData?.role ?? "",
    experiences: initialData?.experiences ?? [],
    achievements: initialData?.achievements ?? [],
    languages: initialData?.languages ?? [],
    featured: initialData?.featured ?? false,
    socialMedia: initialData?.socialMedia ?? {},
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    imageUrl: initialData?.imageUrl ?? "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && initialData) {
        await instructorService.updateInstructor(initialData.id, values, selectedImage);
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
      } else {
        await instructorService.createInstructor({
          ...values,
          imageUrl: values.imageUrl || "", // Ensure imageUrl is never undefined
        }, selectedImage);
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

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Team Member" : "Add Team Member"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Select
                    disabled={isLoadingRoles}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
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

            <div className="space-y-4">
              <FormLabel>Profile Image</FormLabel>
              <FileUpload onFileSelect={handleImageChange} />
            </div>

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Member</FormLabel>
                    <FormDescription>
                      Show this member on the homepage
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
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
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experiences Section */}
            <FormField
              control={form.control}
              name="experiences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiences</FormLabel>
                  <div className="space-y-2">
                    {field.value.map((exp, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={exp.description}
                          onChange={(e) => {
                            const newExperiences = [...field.value];
                            newExperiences[index] = {
                              ...newExperiences[index],
                              description: e.target.value,
                            };
                            field.onChange(newExperiences);
                          }}
                          placeholder="Experience description"
                          className="flex-1"
                        />
                        <Input
                          value={exp.year}
                          onChange={(e) => {
                            const newExperiences = [...field.value];
                            newExperiences[index] = {
                              ...newExperiences[index],
                              year: e.target.value,
                            };
                            field.onChange(newExperiences);
                          }}
                          placeholder="Year"
                          className="w-24"
                        />
                        <Select
                          value={exp.icon}
                          onValueChange={(value) => {
                            const newExperiences = [...field.value];
                            newExperiences[index] = {
                              ...newExperiences[index],
                              icon: value as RacingIcon,
                            };
                            field.onChange(newExperiences);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Trophy">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-racing-red" />
                                <span>Trophy</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Flag">
                              <div className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-racing-red" />
                                <span>Flag</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Medal">
                              <div className="flex items-center gap-2">
                                <Medal className="h-4 w-4 text-racing-red" />
                                <span>Medal</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Star">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-racing-red" />
                                <span>Star</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Crown">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-racing-red" />
                                <span>Crown</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Certificate">
                              <div className="flex items-center gap-2">
                                <ScrollText className="h-4 w-4 text-racing-red" />
                                <span>Certificate</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Timer">
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-racing-red" />
                                <span>Timer</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Car">
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-racing-red" />
                                <span>Car</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Tools">
                              <div className="flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-racing-red" />
                                <span>Tools</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Users">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-racing-red" />
                                <span>Users</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Target">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-racing-red" />
                                <span>Target</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Chart">
                              <div className="flex items-center gap-2">
                                <BarChart2 className="h-4 w-4 text-racing-red" />
                                <span>Chart</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Award">
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-racing-red" />
                                <span>Award</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newExperiences = field.value.filter((_, i) => i !== index);
                            field.onChange(newExperiences);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        field.onChange([
                          ...field.value,
                          { description: "", icon: "Trophy" as RacingIcon, year: "" },
                        ]);
                      }}
                    >
                      Add Experience
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Achievements Section */}
            <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievements</FormLabel>
                  <div className="space-y-2">
                    {field.value.map((achievement, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={achievement.description}
                          onChange={(e) => {
                            const newAchievements = [...field.value];
                            newAchievements[index] = {
                              ...newAchievements[index],
                              description: e.target.value,
                            };
                            field.onChange(newAchievements);
                          }}
                          placeholder="Achievement description"
                          className="flex-1"
                        />
                        <Input
                          value={achievement.year}
                          onChange={(e) => {
                            const newAchievements = [...field.value];
                            newAchievements[index] = {
                              ...newAchievements[index],
                              year: e.target.value,
                            };
                            field.onChange(newAchievements);
                          }}
                          placeholder="Year"
                          className="w-24"
                        />
                        <Select
                          value={achievement.icon}
                          onValueChange={(value) => {
                            const newAchievements = [...field.value];
                            newAchievements[index] = {
                              ...newAchievements[index],
                              icon: value as RacingIcon,
                            };
                            field.onChange(newAchievements);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Trophy">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-racing-red" />
                                <span>Trophy</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Flag">
                              <div className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-racing-red" />
                                <span>Flag</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Medal">
                              <div className="flex items-center gap-2">
                                <Medal className="h-4 w-4 text-racing-red" />
                                <span>Medal</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Star">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-racing-red" />
                                <span>Star</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Crown">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-racing-red" />
                                <span>Crown</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Certificate">
                              <div className="flex items-center gap-2">
                                <ScrollText className="h-4 w-4 text-racing-red" />
                                <span>Certificate</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Timer">
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-racing-red" />
                                <span>Timer</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Car">
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-racing-red" />
                                <span>Car</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Tools">
                              <div className="flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-racing-red" />
                                <span>Tools</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Users">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-racing-red" />
                                <span>Users</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Target">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-racing-red" />
                                <span>Target</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Chart">
                              <div className="flex items-center gap-2">
                                <BarChart2 className="h-4 w-4 text-racing-red" />
                                <span>Chart</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Award">
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-racing-red" />
                                <span>Award</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newAchievements = field.value.filter((_, i) => i !== index);
                            field.onChange(newAchievements);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        field.onChange([
                          ...field.value,
                          { description: "", icon: "Trophy" as RacingIcon, year: "" },
                        ]);
                      }}
                    >
                      Add Achievement
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Languages Section */}
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <div className="space-y-2">
                    {field.value.map((lang, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={lang}
                          onChange={(e) => {
                            const newLanguages = [...field.value];
                            newLanguages[index] = e.target.value;
                            field.onChange(newLanguages);
                          }}
                          placeholder="Language"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newLanguages = field.value.filter((_, i) => i !== index);
                            field.onChange(newLanguages);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        field.onChange([...field.value, ""]);
                      }}
                    >
                      Add Language
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {isEditing ? "Update Team Member" : "Create Team Member"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 