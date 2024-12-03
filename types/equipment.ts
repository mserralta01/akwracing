export type Category = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Brand = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Equipment = {
  id: string
  name: string
  shortDescription: string
  description: string
  brand: Brand
  category: Category
  image?: string
  salePrice?: number
  forSale: boolean
  forLease: boolean
  createdAt: Date
  updatedAt: Date
  brandId?: string
  categoryId?: string
}

export type EquipmentRequirement = {
  equipmentId: string
  quantity: number
  required: boolean
  notes?: string
}

export type EquipmentFormProps = {
  equipmentId?: string
} 