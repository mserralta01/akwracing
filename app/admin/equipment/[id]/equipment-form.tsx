'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { equipmentService } from '@/lib/services/equipment-service'
import { Equipment, Category, Brand } from '@/types/equipment'
import { Loader2, ImageIcon, Upload, DollarSign, Clock, CalendarDays, Package, Tag, Truck, ShoppingCart } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import { Switch } from '@/components/ui/switch'
import { MenuBar } from '@/components/ui/menu-bar'
import { ImageUpload } from '@/components/ui/image-upload'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  salePrice: z.coerce.number().min(0, 'Price cannot be negative'),
  wholesalePrice: z.coerce.number().min(0, 'Wholesale price cannot be negative'),
  hourlyRate: z.coerce.number().min(0, 'Hourly rate cannot be negative'),
  dailyRate: z.coerce.number().min(0, 'Daily rate cannot be negative'),
  weeklyRate: z.coerce.number().min(0, 'Weekly rate cannot be negative'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
  forSale: z.boolean().default(false),
  forLease: z.boolean().default(false),
  imageUrl: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

type Props = {
  id: string
}

export type PreloadedFile = {
  name: string;
  preview: string;
};

export default function EquipmentFormClient({ id }: Props) {
  const isEditing = id !== 'new'
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [forSale, setForSale] = useState(false)
  const [forLease, setForLease] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false
      }),
      Heading.configure({
        levels: [2],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      form.setValue('description', html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none'
      }
    }
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      brandId: '',
      salePrice: 0,
      wholesalePrice: 0,
      hourlyRate: 0,
      dailyRate: 0,
      weeklyRate: 0,
      quantity: 0,
      forSale: false,
      forLease: false,
      imageUrl: ''
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [categoriesData, brandsData] = await Promise.all([
          equipmentService.getCategories(),
          equipmentService.getBrands()
        ])
        
        setCategories(categoriesData)
        setBrands(brandsData)

        if (isEditing) {
          try {
            const result = await equipmentService.getEquipment(id)
            const equipment = Array.isArray(result) ? result[0] : result
            
            if (equipment) {
              form.reset({
                name: equipment.name,
                shortDescription: equipment.shortDescription || '',
                description: equipment.description,
                categoryId: equipment.categoryId,
                brandId: equipment.brandId,
                salePrice: equipment.salePrice || 0,
                wholesalePrice: equipment.wholesalePrice || 0,
                hourlyRate: equipment.hourlyRate || 0,
                dailyRate: equipment.dailyRate || 0,
                weeklyRate: equipment.weeklyRate || 0,
                quantity: equipment.quantity,
                forSale: equipment.forSale,
                forLease: equipment.forLease,
                imageUrl: equipment.imageUrl
              })
              editor?.commands.setContent(equipment.description)
              setForSale(equipment.forSale)
              setForLease(equipment.forLease)
              if (equipment.imageUrl) {
                setImagePreview(equipment.imageUrl)
              }
            }
          } catch (error) {
            console.error('Error loading equipment:', error)
            toast({
              title: 'Error',
              description: 'Failed to load equipment. Please try again.',
              variant: 'destructive'
            })
            router.push('/admin/equipment')
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, isEditing, form, editor, router])

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true)
      
      const formData = {
        ...data,
        imageUrl: imagePreview || undefined,
        updatedBy: user?.uid,
        createdBy: user?.uid
      }
      
      if (isEditing) {
        await equipmentService.updateEquipment(id, formData, selectedImage)
        toast({
          title: 'Success',
          description: 'Equipment updated successfully'
        })
      } else {
        await equipmentService.createEquipment(formData, selectedImage)
        toast({
          title: 'Success',
          description: 'Equipment created successfully'
        })
      }
      
      router.push('/admin/equipment')
    } catch (error) {
      console.error('Error saving equipment:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save equipment. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || authLoading) {
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Equipment Details
              </CardTitle>
              <CardDescription>Basic information about the equipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
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

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the equipment"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Full Description</FormLabel>
                <MenuBar editor={editor} />
                <EditorContent editor={editor} className="min-h-[200px] border rounded-md p-4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Equipment Image
              </CardTitle>
              <CardDescription>Upload an image of the equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onChange={(file) => {
                  setSelectedImage(file || undefined);
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                preloadedImage={imagePreview ? { name: 'Current Image', preview: imagePreview } : null}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
              <CardDescription>Set the pricing options for this equipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="forSale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">For Sale</FormLabel>
                          <FormDescription>
                            Make this equipment available for purchase
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              setForSale(checked)
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {forSale && (
                    <>
                      <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sale Price</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wholesalePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wholesale Price</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="forLease"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">For Lease</FormLabel>
                          <FormDescription>
                            Make this equipment available for lease
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              setForLease(checked)
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {forLease && (
                    <>
                      <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
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
                              <Input type="number" {...field} />
                            </FormControl>
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
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/equipment')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Equipment' : 'Create Equipment'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 