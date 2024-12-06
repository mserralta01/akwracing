"use client";

import { useRouter } from "next/router";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { useState, useEffect } from "react";
import { Category, Brand, Equipment } from "@/types/equipment";
import { equipmentService } from "@/lib/services/equipment-service";
import { useToast } from "@/hooks/use-toast";

export default function NewEquipmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          equipmentService.getCategories(),
          equipmentService.getBrands()
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load categories and brands"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleSubmit = async (data: Partial<Equipment>) => {
    try {
      await equipmentService.createEquipment(data);
      toast({
        description: "Equipment created successfully"
      });
      router.push("/admin/equipment");
    } catch (error) {
      console.error("Error creating equipment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create equipment"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Equipment</h1>
      <EquipmentForm
        categories={categories}
        brands={brands}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 