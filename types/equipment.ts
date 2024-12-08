export type Category = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Brand {
  id: string;
  name: string;
}

export type EquipmentType = "Helmet" | "Suit" | "Gloves" | "Boots" | "Kart" | "Other";

export type Equipment = {
  id: string;
  name: string;
  type: EquipmentType;
  description: string;
  inStock: number;
  purchasePrice?: number;
  sellingPrice?: number;
  wholesalePrice?: number;
  imageUrl?: string;
  brandId?: string;
  categoryId?: string;
  brand?: { id: string; name: string };
  category?: { id: string; name: string };
  shortDescription?: string;
  leasePrice?: number;
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  condition?: string;
  leaseTerm?: string;
  forSale?: boolean;
  forLease?: boolean;
};

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

export interface BrandManagerProps {
  brands: Brand[];
  onAdd: (name: string) => Promise<void>;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
} 