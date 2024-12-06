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
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const data = await equipmentService.getEquipment();
      setEquipment(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load equipment";
      console.error("Error loading equipment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Selected file must be an image",
          variant: "destructive",
        });
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

  const onSubmit = async (data: FormData) => {
    try {
      // Validate the data before sending
      if (!data.name?.trim()) {
        throw new Error("Name is required");
      }
      if (!data.type) {
        throw new Error("Type is required");
      }
      if (!data.description?.trim()) {
        throw new Error("Description is required");
      }
      if (data.inStock === undefined || data.inStock === null) {
        throw new Error("In Stock quantity is required");
      }

      // Format the data
      const equipmentData = {
        name: data.name.trim(),
        type: data.type as EquipmentType,
        description: data.description.trim(),
        inStock: Number(data.inStock),
        purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined,
        sellingPrice: data.sellingPrice ? Number(data.sellingPrice) : undefined,
      };

      // Validate numbers
      if (isNaN(equipmentData.inStock) || equipmentData.inStock < 0) {
        throw new Error("In Stock must be a valid non-negative number");
      }
      if (equipmentData.purchasePrice !== undefined && (isNaN(equipmentData.purchasePrice) || equipmentData.purchasePrice < 0)) {
        throw new Error("Purchase Price must be a valid non-negative number");
      }
      if (equipmentData.sellingPrice !== undefined && (isNaN(equipmentData.sellingPrice) || equipmentData.sellingPrice < 0)) {
        throw new Error("Selling Price must be a valid non-negative number");
      }

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
      const message = error instanceof Error ? error.message : "Failed to save equipment";
      console.error("Error saving equipment:", error);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await equipmentService.deleteEquipment(id);
      toast({
        title: "Success",
        description: "Equipment deleted successfully",
      });
      loadEquipment();
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast({
        title: "Error",
        description: "Failed to delete equipment",
        variant: "destructive",
      });
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
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
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedEquipment ? "Edit Equipment" : "Add New Equipment"}
                </DialogTitle>
                <DialogDescription>
                  {selectedEquipment
                    ? "Update the equipment details below"
                    : "Fill in the equipment details below"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Equipment name" {...field} />
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
                          <Textarea
                            placeholder="Equipment description"
                            {...field}
                          />
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
                            <Input
                              type="number"
                              {...field}
                            />
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
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              value={field.value ?? ""}
                            />
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
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <div className="relative w-40 h-40">
                            <Image
                              src={imagePreview}
                              alt="Equipment preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image of the equipment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  <DialogFooter>
                    <Button type="submit">
                      {selectedEquipment ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative w-12 h-12">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.inStock}</TableCell>
                  <TableCell>
                    {item.purchasePrice
                      ? `$${item.purchasePrice.toFixed(2)}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.sellingPrice
                      ? `$${item.sellingPrice.toFixed(2)}`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedEquipment(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this equipment? This
                              action cannot be undone.
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
        </CardContent>
      </Card>
    </div>
  );
} 