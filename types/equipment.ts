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
  brand: string
  category: string
  image: string
  salePrice?: number
  forSale: boolean
  forLease: boolean
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