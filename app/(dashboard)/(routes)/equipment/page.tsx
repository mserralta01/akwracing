'use client'

import { useState, useEffect } from 'react'
import { CategoryManager } from '@/components/equipment/category-manager'
import { BrandManager } from '@/components/equipment/brand-manager'
import { EquipmentForm } from '@/components/equipment/equipment-form'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Equipment, Category, Brand } from '@/types/equipment'
import { ColumnDef } from '@tanstack/react-table'
import { equipmentService } from '@/lib/services/equipment-service'
import { useToast } from '@/components/ui/use-toast'

export default function EquipmentPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [equipmentData, categoriesData, brandsData] = await Promise.all([
        equipmentService.getEquipment(),
        equipmentService.getCategories(),
        equipmentService.getBrands(),
      ])
      setEquipment(equipmentData)
      setCategories(categoriesData)
      setBrands(brandsData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      })
    }
  }

  const handleAddCategory = async (name: string) => {
    try {
      await equipmentService.createCategory({ name })
      await loadData()
      toast({
        title: 'Success',
        description: 'Category added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive',
      })
    }
  }

  const handleEditCategory = async (id: string, name: string) => {
    try {
      await equipmentService.updateCategory(id, { name })
      await loadData()
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await equipmentService.deleteCategory(id)
      await loadData()
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      })
    }
  }

  const handleAddBrand = async (name: string) => {
    try {
      await equipmentService.createBrand({ name })
      await loadData()
      toast({
        title: 'Success',
        description: 'Brand added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add brand',
        variant: 'destructive',
      })
    }
  }

  const handleEditBrand = async (id: string, name: string) => {
    try {
      await equipmentService.updateBrand(id, { name })
      await loadData()
      toast({
        title: 'Success',
        description: 'Brand updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update brand',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteBrand = async (id: string) => {
    try {
      await equipmentService.deleteBrand(id)
      await loadData()
      toast({
        title: 'Success',
        description: 'Brand deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete brand',
        variant: 'destructive',
      })
    }
  }

  const handleAddEquipment = async (data: Partial<Equipment>) => {
    try {
      await equipmentService.createEquipment(data)
      await loadData()
      setIsAddDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Equipment added successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add equipment',
        variant: 'destructive',
      })
    }
  }

  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'category.name',
      header: 'Category',
    },
    {
      accessorKey: 'brand.name',
      header: 'Brand',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const price = row.original.price;
        return price ? `$${price.toFixed(2)}` : 'N/A';
      },
    },
    {
      accessorKey: 'leasePrice',
      header: 'Lease Price (per day)',
      cell: ({ row }) => `$${row.original.leasePrice.toFixed(2)}`,
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipment Management</h1>
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Equipment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <EquipmentForm
                categories={categories}
                brands={brands}
                onSubmit={handleAddEquipment}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={equipment.filter((e) => 
          !selectedCategory || e.categoryId === selectedCategory
        )}
      />
    </div>
  )
} 