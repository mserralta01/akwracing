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

export type EquipmentType = 
  | "Helmet"
  | "Suit"
  | "Gloves"
  | "Boots"
  | "Kart"
  | "Other";

export type EquipmentStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "RETIRED";

export type Equipment = {
  id: string;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  brandId: string;
  categoryId: string;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  imageUrl: string;
  shortDescription?: string;
  description: string;
  inStock: number;
  purchasePrice?: number;
  sellingPrice?: number;
  quantity: number;
  price?: number;
  salePrice?: number;
  wholesalePrice?: number;
  leasePrice?: number;
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  condition?: string;
  leaseTerm?: string;
  forSale: boolean;
  forLease: boolean;
}

export type EquipmentRequirement = {
  equipmentId: string
  quantity: number
  required: boolean
  notes?: string
}

export type EquipmentFormProps = {
  equipmentId?: string;
  categories: Category[];
  brands: Brand[];
  onSubmit: (data: Partial<Equipment>) => Promise<void>;
}

export type PreloadedFile = {
  preview: string;
  name: string;
  size: number;
  type: string;
}; 