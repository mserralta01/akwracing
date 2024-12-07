'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { equipmentService } from '@/lib/services/equipment-service'
import { Equipment, Category, Brand } from '@/types/equipment'
import { Loader2, ImageIcon, DollarSign, Clock, CalendarDays, Package, Tag, Truck, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { ImageUpload, type PreloadedFile } from '@/components/ui/image-upload'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  sellingPrice: z.coerce.number().min(0, 'Price cannot be negative'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price cannot be negative'),
  hourlyRate: z.coerce.number().min(0, 'Hourly rate cannot be negative'),
  dailyRate: z.coerce.number().min(0, 'Daily rate cannot be negative'),
  weeklyRate: z.coerce.number().min(0, 'Weekly rate cannot be negative'),
  inStock: z.coerce.number().min(0, 'Stock cannot be negative'),
  forSale: z.boolean().default(false),
  forLease: z.boolean().default(false)
})

type FormData = z.infer<typeof formSchema>

type Props = {
  id: string
}

export default function EquipmentForm({ id }: Props) {
  const isEditing = id !== 'new'
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<PreloadedFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [forSale, setForSale] = useState(false)
  const [forLease, setForLease] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      brandId: '',
      sellingPrice: 0,
      purchasePrice: 0,
      hourlyRate: 0,
      dailyRate: 0,
      weeklyRate: 0,
      inStock: 0,
      forSale: false,
      forLease: false
    }
  })

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    const loadInitialData = async () => {
      try {
        setLoading(true)
        const [categoriesData, brandsData] = await Promise.all([
          equipmentService.getCategories(),
          equipmentService.getBrands()
        ])
        setCategories(categoriesData)
        setBrands(brandsData)

        if (isEditing) {
          const equipment = await equipmentService.getEquipmentById(id)
          if (equipment) {
            form.reset({
              name: equipment.name || '',
              shortDescription: equipment.shortDescription || '',
              description: equipment.description || '',
              categoryId: equipment.categoryId || '',
              brandId: equipment.brandId || '',
              sellingPrice: equipment.sellingPrice || 0,
              purchasePrice: equipment.purchasePrice || 0,
              hourlyRate: equipment.hourlyRate || 0,
              dailyRate: equipment.dailyRate || 0,
              weeklyRate: equipment.weeklyRate || 0,
              inStock: equipment.inStock || 0,
              forSale: equipment.forSale || false,
              forLease: equipment.forLease || false
            })
            setForSale(equipment.forSale || false)
            setForLease(equipment.forLease || false)
            
            if (equipment.imageUrl) {
              setImagePreview({
                preview: equipment.imageUrl,
                name: equipment.imageUrl.split('/').pop() || 'Current Image',
                size: 0,
                type: 'image/*'
              })
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load equipment data',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [authLoading, user, router, isEditing, id, form])

  const handleImageChange = useCallback(async (file: File | null) => {
    setSelectedImage(file)
    if (file) {
      try {
        // Create a temporary preview URL for the UI
        const previewUrl = URL.createObjectURL(file)
        setImagePreview({
          preview: previewUrl,
          name: file.name,
          size: file.size,
          type: file.type
        })
      } catch (error) {
        console.error('Error handling image:', error)
        toast({
          title: 'Error',
          description: 'Failed to preview image',
          variant: 'destructive'
        })
      }
    } else {
      setImagePreview(null)
    }
  }, [toast])

  const onSubmit = async (data: FormData) => {
    try {
      // Validate required fields based on toggles
      if (forSale && data.sellingPrice <= 0) {
        form.setError('sellingPrice', { message: 'Retail price is required when for sale is enabled' })
        return
      }

      if (forLease && data.hourlyRate <= 0 && data.dailyRate <= 0 && data.weeklyRate <= 0) {
        form.setError('hourlyRate', { message: 'At least one lease rate is required when for lease is enabled' })
        return
      }

      setSubmitting(true)

      const cleanData: Partial<Equipment> = {
        ...data,
        sellingPrice: forSale ? data.sellingPrice : 0,
        purchasePrice: forSale ? data.purchasePrice : 0,
        hourlyRate: forLease ? data.hourlyRate : 0,
        dailyRate: forLease ? data.dailyRate : 0,
        weeklyRate: forLease ? data.weeklyRate : 0,
        forSale,
        forLease
      }

      if (isEditing) {
        await equipmentService.updateEquipment(id, cleanData, selectedImage || undefined)
      } else {
        await equipmentService.createEquipment(cleanData, selectedImage || undefined)
      }

      toast({
        title: 'Success',
        description: `Equipment ${isEditing ? 'updated' : 'created'} successfully`
      })
      
      router.push('/admin/equipment')
      router.refresh()
    } catch (error) {
      console.error('Error saving equipment:', error)
      toast({
        title: 'Error',
        description: 'Failed to save equipment',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-8 w-8" />
          {isEditing ? 'Edit Equipment' : 'Add New Equipment'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Update the equipment details below' : 'Enter the equipment details below'}
        </p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-14">
          <TabsTrigger value="details" className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5" />
            Details
          </TabsTrigger>
          <div className="relative">
            <TabsTrigger value="sell" className="flex items-center gap-2 text-lg w-full">
              <ShoppingCart className="h-5 w-5" />
              Sell
            </TabsTrigger>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
              <Switch
                checked={forSale}
                onCheckedChange={(checked) => {
                  setForSale(checked)
                  form.setValue('forSale', checked)
                }}
                className={cn(
                  forSale ? "bg-green-500" : "bg-red-500",
                  "focus-visible:ring-0"
                )}
              />
            </div>
          </div>
          <div className="relative">
            <TabsTrigger value="lease" className="flex items-center gap-2 text-lg w-full">
              <Clock className="h-5 w-5" />
              Lease
            </TabsTrigger>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
              <Switch
                checked={forLease}
                onCheckedChange={(checked) => {
                  setForLease(checked)
                  form.setValue('forLease', checked)
                }}
                className={cn(
                  forLease ? "bg-green-500" : "bg-red-500",
                  "focus-visible:ring-0"
                )}
              />
            </div>
          </div>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Equipment Details
                  </CardTitle>
                  <CardDescription>Basic information about the equipment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
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
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
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
                              <Textarea {...field} className="min-h-[120px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                      {category.name}
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
                          name="brandId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a brand" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {brands.map((brand) => (
                                    <SelectItem key={brand.id} value={brand.id}>
                                      {brand.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Truck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input type="number" {...field} className="pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Equipment Image</Label>
                        <ImageUpload
                          onChange={handleImageChange}
                          preloadedImage={imagePreview}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sell">
              {forSale ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Sales Information
                    </CardTitle>
                    <CardDescription>Set the pricing for selling this equipment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="sellingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Retail Price *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="number" 
                                  {...field}
                                  className="pl-10" 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>The regular selling price (required)</FormDescription>
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
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="number" 
                                  {...field}
                                  className="pl-10" 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>Price for bulk or dealer purchases</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-5 w-5" />
                      Sales Disabled
                    </CardTitle>
                    <CardDescription>Enable the sale toggle to set pricing information</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="lease">
              {forLease ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Leasing Rates
                    </CardTitle>
                    <CardDescription>Set the rates for different leasing periods (at least one rate required)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="number" 
                                  {...field}
                                  className="pl-10" 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>Rate per hour</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dailyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daily Rate</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="number" 
                                  {...field}
                                  className="pl-10" 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>Rate per day</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weeklyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weekly Rate</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="number" 
                                  {...field}
                                  className="pl-10" 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>Rate per week</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      Lease Disabled
                    </CardTitle>
                    <CardDescription>Enable the lease toggle to set leasing rates</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update' : 'Create'} Equipment
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  )
} 