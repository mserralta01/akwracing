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
  categoryId: string
  category: Category
  brandId: string
  brand: Brand
  price: number
  leasePrice: number
  wholesalePrice: number
  quantity: number
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED'
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
} 