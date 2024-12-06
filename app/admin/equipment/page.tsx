'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Pencil, Trash2, ImageIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Equipment, Category, Brand } from '@/types/equipment'
import { equipmentService } from '@/lib/services/equipment-service'
import { CategoryManager } from '@/components/equipment/category-manager'
import { BrandManager } from '@/components/equipment/brand-manager'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { ViewToggle } from '@/components/equipment/view-toggle'
import { EquipmentGrid } from '@/components/equipment/equipment-grid'
import { EquipmentTable } from '@/components/equipment/equipment-table'

type ViewMode = 'grid' | 'table'

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [equipmentData, categoriesData, brandsData] = await Promise.all([
        equipmentService.getEquipment() as Promise<Equipment[]>,
        equipmentService.getCategories(),
        equipmentService.getBrands()
      ])
      setEquipment(equipmentData)
      setCategories(categoriesData)
      setBrands(brandsData)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load equipment data. Please try refreshing the page.')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load data'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    loadData()
  }, [user, router, authLoading])

  const handleDelete = async (id: string) => {
    try {
      await equipmentService.deleteEquipment(id)
      await loadData()
      toast({
        description: 'Equipment deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting equipment:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete equipment'
      })
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/equipment/${id}`)
  }

  const handleAddCategory = async (name: string) => {
    try {
      await equipmentService.createCategory({ name })
      await loadData()
      toast({
        description: 'Category added successfully'
      })
    } catch (error) {
      console.error('Error adding category:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to add category'
      })
    }
  }

  const handleEditCategory = async (id: string, name: string) => {
    try {
      await equipmentService.updateCategory(id, { name })
      await loadData()
      toast({
        description: 'Category updated successfully'
      })
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to update category'
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await equipmentService.deleteCategory(id)
      await loadData()
      toast({
        description: 'Category deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to delete category'
      })
    }
  }

  const handleAddBrand = async (name: string) => {
    try {
      await equipmentService.createBrand({ name })
      await loadData()
      toast({
        description: 'Brand added successfully'
      })
    } catch (error) {
      console.error('Error adding brand:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to add brand'
      })
    }
  }

  const handleEditBrand = async (id: string, name: string) => {
    try {
      await equipmentService.updateBrand(id, { name })
      await loadData()
      toast({
        description: 'Brand updated successfully'
      })
    } catch (error) {
      console.error('Error updating brand:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to update brand'
      })
    }
  }

  const handleDeleteBrand = async (id: string) => {
    try {
      await equipmentService.deleteBrand(id)
      await loadData()
      toast({
        description: 'Brand deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting brand:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to delete brand'
      })
    }
  }

  const filteredEquipment = equipment.filter(
    (item) => selectedCategory === "all" || item.category?.id === selectedCategory
  )

  if (authLoading || loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="shadow-lg">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={loadData}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Equipment List</CardTitle>
            <CardDescription>Manage your racing equipment inventory</CardDescription>
          </div>
          <div className="flex gap-2">
            <CategoryManager
              categories={categories}
              onAdd={handleAddCategory}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
            <BrandManager
              brands={brands}
              onAdd={handleAddBrand}
              onEdit={handleEditBrand}
              onDelete={handleDeleteBrand}
            />
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            <Button asChild>
              <Link href="/admin/equipment/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {viewMode === 'table' ? (
            <EquipmentTable
              equipment={filteredEquipment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <EquipmentGrid
              equipment={filteredEquipment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 