"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Equipment, EquipmentType } from "@/types/equipment";
import { equipmentService } from "@/lib/services/equipment-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useLoadingState } from "@/hooks/use-loading-state";

const equipmentTypes: EquipmentType[] = [
  "Helmet",
  "Suit",
  "Gloves",
  "Boots",
  "Kart",
  "Other",
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["Helmet", "Suit", "Gloves", "Boots", "Kart", "Other"]),
  description: z.string().min(1, "Description is required"),
  inStock: z.coerce.number().min(0, "Stock cannot be negative"),
  purchasePrice: z.coerce.number().min(0, "Price cannot be negative").optional(),
  sellingPrice: z.coerce.number().min(0, "Price cannot be negative").optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { handleError } = useErrorHandler();
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Other",
      description: "",
      inStock: 0,
      purchasePrice: undefined,
      sellingPrice: undefined,
    },
  });

  useEffect(() => {
    if (!authLoading && user) {
      loadEquipment();
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (selectedEquipment) {
      form.reset({
        name: selectedEquipment.name,
        type: selectedEquipment.type,
        description: selectedEquipment.description,
        inStock: selectedEquipment.inStock,
        purchasePrice: selectedEquipment.purchasePrice,
        sellingPrice: selectedEquipment.sellingPrice,
      });
      setImagePreview(selectedEquipment.imageUrl || null);
    } else {
      form.reset({
        name: "",
        type: "Other",
        description: "",
        inStock: 0,
        purchasePrice: undefined,
        sellingPrice: undefined,
      });
      setImagePreview(null);
    }
  }, [selectedEquipment, form]);

  const loadEquipment = async () => {
    try {
      startLoading("Loading equipment...");
      const data = await equipmentService.getEquipment();
      setEquipment(data);
    } catch (error) {
      handleError(error, {
        logToConsole: true,
        throwError: false,
      });
    } finally {
      stopLoading();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        handleError("Selected file must be an image");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      startLoading("Deleting equipment...");
      await equipmentService.deleteEquipment(id);
      toast({
        title: "Success",
        description: "Equipment deleted successfully",
      });
      await loadEquipment();
    } catch (error) {
      handleError(error);
    } finally {
      stopLoading();
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      startLoading(selectedEquipment ? "Updating equipment..." : "Creating equipment...");

      const equipmentData = {
        name: data.name.trim(),
        type: data.type as EquipmentType,
        description: data.description.trim(),
        inStock: Number(data.inStock),
        purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined,
        sellingPrice: data.sellingPrice ? Number(data.sellingPrice) : undefined,
      };

      if (selectedEquipment) {
        await equipmentService.updateEquipment(
          selectedEquipment.id,
          equipmentData,
          selectedImage || undefined
        );
        toast({
          title: "Success",
          description: "Equipment updated successfully",
        });
      } else {
        await equipmentService.createEquipment(
          equipmentData,
          selectedImage || undefined
        );
        toast({
          title: "Success",
          description: "Equipment created successfully",
        });
      }

      setIsDialogOpen(false);
      setSelectedEquipment(null);
      setSelectedImage(null);
      setImagePreview(null);
      form.reset();
      await loadEquipment();
    } catch (error) {
      handleError(error);
    } finally {
      stopLoading();
    }
  };

  if (authLoading) {
    return <LoadingSpinner isLoading variant="large" loadingMessage="Loading..." />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Equipment List</CardTitle>
              <CardDescription>Manage your racing equipment inventory</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setSelectedEquipment(null);
                    form.reset();
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="bg-racing-red hover:bg-racing-red/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedEquipment ? "Edit Equipment" : "Add New Equipment"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details below to {selectedEquipment ? "update" : "add"} equipment.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select equipment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {equipmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>In Stock</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="purchasePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purchase Price</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sellingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selling Price</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormLabel>Image</FormLabel>
                      <div className="mt-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="mb-4"
                        />
                        <div className="flex justify-center">
                          {imagePreview && (
                            <div className="relative w-40 h-40">
                              <OptimizedImage
                                src={imagePreview}
                                alt="Equipment preview"
                                width={160}
                                height={160}
                                className="rounded-lg object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <LoadingSpinner isLoading variant="small" />
                        ) : selectedEquipment ? (
                          "Update Equipment"
                        ) : (
                          "Add Equipment"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SkeletonLoader variant="table-row" count={5} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.imageUrl ? (
                          <OptimizedImage
                            src={item.imageUrl}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                            fallbackSrc="/placeholder-image.jpg"
                          />
                        ) : (
                          <div className="h-[50px] w-[50px] rounded-md bg-muted flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.inStock}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedEquipment(item);
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this equipment? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
} 