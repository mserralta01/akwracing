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
  id?: string
  name: string
  brandId?: string
  categoryId?: string
  brand: { id: string; name: string }
  category: { id: string; name: string }
  imageUrl: string
  image?: string
  shortDescription?: string
  description?: string
  quantity?: number
  salePrice?: number
  leasePrice?: number
  condition?: string
  leaseTerm?: string
  forSale: boolean
  forLease: boolean
  hourlyRate?: number
  dailyRate?: number
  weeklyRate?: number
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