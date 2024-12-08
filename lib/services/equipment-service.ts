import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Equipment, Category, Brand, EquipmentType } from "@/types/equipment";

const EQUIPMENT_COLLECTION = "equipment";
const CATEGORY_COLLECTION = "equipment_categories";
const BRAND_COLLECTION = "equipment_brands";

export const equipmentService = {
  // Equipment functions
  async getEquipment(): Promise<Equipment[]> {
    try {
      const equipmentQuery = query(
        collection(db, EQUIPMENT_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(equipmentQuery);
      
      // Get all categories and brands first
      const categories = await this.getCategories();
      const brands = await this.getBrands();
      
      // Create lookup maps
      const categoryMap = new Map(categories.map(c => [c.id, c]));
      const brandMap = new Map(brands.map(b => [b.id, b]));

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const category = categoryMap.get(data.categoryId);
        const brand = brandMap.get(data.brandId);
        
        if (!category || !brand) {
          console.warn(`Missing category or brand for equipment ${doc.id}`);
        }

        return {
          id: doc.id,
          name: data.name,
          type: data.type as EquipmentType,
          description: data.description || "",
          inStock: data.inStock || 0,
          brandId: data.brandId,
          categoryId: data.categoryId,
          brand: brand || { id: '', name: 'Unknown Brand' },
          category: category || { id: '', name: 'Unknown Category' },
          imageUrl: data.imageUrl || '',
          shortDescription: data.shortDescription,
          purchasePrice: data.purchasePrice,
          sellingPrice: data.sellingPrice,
          leasePrice: data.leasePrice,
          hourlyRate: data.hourlyRate,
          dailyRate: data.dailyRate,
          weeklyRate: data.weeklyRate,
          condition: data.condition,
          leaseTerm: data.leaseTerm,
          forSale: data.forSale,
          forLease: data.forLease,
        };
      });
    } catch (error) {
      console.error("Error getting equipment:", error);
      throw new Error("Failed to fetch equipment");
    }
  },

  async getEquipmentById(id: string): Promise<Equipment | null> {
    try {
      const docRef = doc(db, EQUIPMENT_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      
      const data = docSnap.data();
      
      // Get category and brand
      let category = null;
      let brand = null;
      if (data.categoryId) {
        const categoryDoc = await getDoc(doc(db, CATEGORY_COLLECTION, data.categoryId));
        if (categoryDoc.exists()) {
          category = { id: categoryDoc.id, ...categoryDoc.data() } as Category;
        }
      }
      if (data.brandId) {
        const brandDoc = await getDoc(doc(db, BRAND_COLLECTION, data.brandId));
        if (brandDoc.exists()) {
          brand = { id: brandDoc.id, ...brandDoc.data() } as Brand;
        }
      }

      return {
        id: docSnap.id,
        name: data.name,
        type: data.type as EquipmentType,
        description: data.description || "",
        inStock: data.inStock || 0,
        brandId: data.brandId,
        categoryId: data.categoryId,
        brand: brand || { id: '', name: 'Unknown Brand' },
        category: category || { id: '', name: 'Unknown Category' },
        imageUrl: data.imageUrl || '',
        shortDescription: data.shortDescription,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        leasePrice: data.leasePrice,
        hourlyRate: data.hourlyRate,
        dailyRate: data.dailyRate,
        weeklyRate: data.weeklyRate,
        condition: data.condition,
        leaseTerm: data.leaseTerm,
        forSale: data.forSale,
        forLease: data.forLease,
      };
    } catch (error) {
      console.error("Error getting equipment by ID:", error);
      throw new Error("Failed to fetch equipment by ID");
    }
  },

  async createEquipment(data: Partial<Equipment>, image?: File): Promise<string> {
    try {
      let imageUrl = undefined;
      if (image) {
        const storageRef = ref(storage, `equipment/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      console.log('Received data for creation:', data);

      const equipmentData = {
        name: data.name || "",
        type: data.type || "Other",
        description: data.description || "",
        inStock: data.inStock || 0,
        shortDescription: data.shortDescription,
        brandId: data.brandId || data.brand?.id,
        categoryId: data.categoryId || data.category?.id,
        imageUrl: imageUrl || data.imageUrl,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        leasePrice: data.leasePrice,
        hourlyRate: data.hourlyRate,
        dailyRate: data.dailyRate,
        weeklyRate: data.weeklyRate,
        forSale: data.forSale ?? false,
        forLease: data.forLease ?? false,
        condition: data.condition,
        leaseTerm: data.leaseTerm,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log('Creating equipment with data:', equipmentData);

      const docRef = await addDoc(collection(db, EQUIPMENT_COLLECTION), equipmentData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating equipment:", error);
      throw new Error("Failed to create equipment");
    }
  },

  async updateEquipment(id: string, data: Partial<Equipment>, image?: File): Promise<void> {
    try {
      console.log('Received data for update:', data);

      const docRef = doc(db, EQUIPMENT_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Equipment not found");

      let imageUrl = data.imageUrl;
      if (image) {
        // Delete old image if it exists
        const currentData = docSnap.data();
        if (currentData.imageUrl) {
          try {
            const oldImageRef = ref(storage, currentData.imageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.warn("Error deleting old image:", error);
          }
        }

        // Upload new image
        const storageRef = ref(storage, `equipment/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const updateData = {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.inStock !== undefined && { inStock: data.inStock }),
        ...(data.brandId && { brandId: data.brandId }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(imageUrl && { imageUrl }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.purchasePrice !== undefined && { purchasePrice: data.purchasePrice }),
        ...(data.sellingPrice !== undefined && { sellingPrice: data.sellingPrice }),
        ...(data.leasePrice !== undefined && { leasePrice: data.leasePrice }),
        ...(data.hourlyRate !== undefined && { hourlyRate: data.hourlyRate }),
        ...(data.dailyRate !== undefined && { dailyRate: data.dailyRate }),
        ...(data.weeklyRate !== undefined && { weeklyRate: data.weeklyRate }),
        ...(data.condition !== undefined && { condition: data.condition }),
        ...(data.leaseTerm !== undefined && { leaseTerm: data.leaseTerm }),
        ...(data.forSale !== undefined && { forSale: data.forSale }),
        ...(data.forLease !== undefined && { forLease: data.forLease }),
        updatedAt: serverTimestamp(),
      };

      console.log('Update data before saving:', updateData);

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating equipment:", error);
      throw new Error("Failed to update equipment");
    }
  },

  async deleteEquipment(id: string): Promise<void> {
    try {
      const docRef = doc(db, EQUIPMENT_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Equipment not found");

      // Delete image if it exists
      if (docSnap.data().imageUrl) {
        const imageRef = ref(storage, docSnap.data().imageUrl);
        await deleteObject(imageRef);
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting equipment:", error);
      throw new Error("Failed to delete equipment");
    }
  },

  // Category functions
  async getCategories(): Promise<Category[]> {
    try {
      const categoryQuery = query(
        collection(db, CATEGORY_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(categoryQuery);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as Category;
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      throw new Error("Failed to fetch categories");
    }
  },

  async createCategory(data: Pick<Category, "name">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CATEGORY_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  },

  async updateCategory(id: string, data: Pick<Category, "name">): Promise<void> {
    try {
      const docRef = doc(db, CATEGORY_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category");
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, CATEGORY_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  },

  // Brand functions
  async getBrands(): Promise<Brand[]> {
    try {
      const brandsQuery = query(
        collection(db, BRAND_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(brandsQuery);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        } as Brand;
      });
    } catch (error) {
      console.error("Error getting brands:", error);
      throw new Error("Failed to fetch brands");
    }
  },

  async createBrand(data: Pick<Brand, "name">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, BRAND_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating brand:", error);
      throw new Error("Failed to create brand");
    }
  },

  async updateBrand(id: string, data: Pick<Brand, "name">): Promise<void> {
    try {
      const docRef = doc(db, BRAND_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating brand:", error);
      throw new Error("Failed to update brand");
    }
  },

  async deleteBrand(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, BRAND_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting brand:", error);
      throw new Error("Failed to delete brand");
    }
  },
}; 