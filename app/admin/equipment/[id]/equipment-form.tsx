'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { equipmentService } from '@/lib/services/equipment-service'
import { Equipment, Category, Brand } from '@/types/equipment'
import { Loader2, ImageIcon, Upload, DollarSign, Clock, CalendarDays, Package, Tag, Truck, ShoppingCart, Bold, Italic, List, ListOrdered, Heading2, Quote } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import { Toggle } from '@/components/ui/toggle'

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-1 flex flex-wrap gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
    </div>
  )
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  leasePrice: z.coerce.number().min(0, 'Lease price cannot be negative'),
  hourlyRate: z.coerce.number().min(0, 'Hourly rate cannot be negative'),
  dailyRate: z.coerce.number().min(0, 'Daily rate cannot be negative'),
  weeklyRate: z.coerce.number().min(0, 'Weekly rate cannot be negative'),
  wholesalePrice: z.coerce.number().min(0, 'Wholesale price cannot be negative'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED'])
})

type FormData = z.infer<typeof formSchema>

type Props = {
  id: string
}

export default function EquipmentFormClient({ id }: Props) {
  const isEditing = id !== 'new'
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
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
    },
    immediatelyRender: false
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      brandId: '',
      price: 0,
      leasePrice: 0,
      hourlyRate: 0,
      dailyRate: 0,
      weeklyRate: 0,
      wholesalePrice: 0,
      quantity: 0,
      status: 'AVAILABLE'
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
              price: equipment.price || 0,
              leasePrice: equipment.leasePrice || 0,
              hourlyRate: equipment.hourlyRate || 0,
              dailyRate: equipment.dailyRate || 0,
              weeklyRate: equipment.weeklyRate || 0,
              wholesalePrice: equipment.wholesalePrice || 0,
              quantity: equipment.quantity || 0,
              status: equipment.status || 'AVAILABLE'
            })
            if (equipment.description) {
              editor?.commands.setContent(equipment.description)
            }
            setImagePreview(equipment.imageUrl || null)
          }
        } else {
          form.reset({
            name: '',
            shortDescription: '',
            description: '',
            categoryId: '',
            brandId: '',
            price: 0,
            leasePrice: 0,
            hourlyRate: 0,
            dailyRate: 0,
            weeklyRate: 0,
            wholesalePrice: 0,
            quantity: 0,
            status: 'AVAILABLE'
          })
          editor?.commands.setContent('')
          setImagePreview(null)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load data. Please try again.'
        })
        router.push('/admin/equipment')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [isEditing, id, form, router, toast, user, authLoading, editor])

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true)
      const cleanData = {
        ...data,
        description: editor?.getHTML() || data.description,
        hourlyRate: data.hourlyRate || 0,
        dailyRate: data.dailyRate || 0,
        weeklyRate: data.weeklyRate || 0,
      }

      if (isEditing) {
        await equipmentService.updateEquipment(id, cleanData, selectedImage || undefined)
      } else {
        await equipmentService.createEquipment(cleanData, selectedImage || undefined)
      }
      toast({
        description: `Equipment ${isEditing ? 'updated' : 'created'} successfully`
      })
      router.push('/admin/equipment')
      router.refresh()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} equipment`
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
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
          <TabsTrigger value="sell" className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            Sell
          </TabsTrigger>
          <TabsTrigger value="lease" className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Lease
          </TabsTrigger>
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
                              <div className="border rounded-md">
                                <MenuBar editor={editor} />
                                <div className="p-4 min-h-[200px]">
                                  <EditorContent editor={editor} className="prose prose-sm max-w-none" />
                                </div>
                              </div>
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

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
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

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="AVAILABLE">Available</SelectItem>
                                  <SelectItem value="IN_USE">In Use</SelectItem>
                                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                  <SelectItem value="RETIRED">Retired</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <FormLabel>Equipment Image</FormLabel>
                      <div 
                        className={cn(
                          "border-2 border-dashed rounded-lg p-4 h-[300px] flex flex-col items-center justify-center cursor-pointer transition-colors",
                          dragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary/50",
                          "relative"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('imageInput')?.click()}
                      >
                        <input
                          id="imageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                              <span className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
                                Upload an image
                              </span>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sell">
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
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retail Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="number" 
                                {...field}
                                value={field.value || 0}
                                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                className="pl-10" 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>The regular selling price</FormDescription>
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
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="number" 
                                {...field}
                                value={field.value || 0}
                                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
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
            </TabsContent>

            <TabsContent value="lease">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Leasing Rates
                  </CardTitle>
                  <CardDescription>Set the rates for different leasing periods</CardDescription>
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
                                value={field.value || 0}
                                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
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
                                value={field.value || 0}
                                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
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
                                value={field.value || 0}
                                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
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
            </TabsContent>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/equipment')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700">
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