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
import { Equipment, Category, Brand } from "@/types/equipment";

const EQUIPMENT_COLLECTION = "equipment";
const CATEGORY_COLLECTION = "equipment_categories";
const BRAND_COLLECTION = "equipment_brands";

export const equipmentService = {
  // Equipment functions
  async getEquipment(id?: string): Promise<Equipment | Equipment[]> {
    try {
      if (id) {
        const docRef = doc(db, EQUIPMENT_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error("Equipment not found");
        }
        
        const data = docSnap.data();
        
        // Get category and brand
        let category = null;
        let brand = null;
        if (data.categoryId) {
          const categoryDoc = await getDoc(doc(db, CATEGORY_COLLECTION, data.categoryId));
          if (categoryDoc.exists()) {
            category = { 
              id: categoryDoc.id, 
              name: categoryDoc.data().name,
              createdAt: categoryDoc.data().createdAt?.toDate() || new Date(),
              updatedAt: categoryDoc.data().updatedAt?.toDate() || new Date()
            } as Category;
          }
        }
        if (data.brandId) {
          const brandDoc = await getDoc(doc(db, BRAND_COLLECTION, data.brandId));
          if (brandDoc.exists()) {
            brand = { 
              id: brandDoc.id, 
              name: brandDoc.data().name,
              createdAt: brandDoc.data().createdAt?.toDate() || new Date(),
              updatedAt: brandDoc.data().updatedAt?.toDate() || new Date()
            } as Brand;
          }
        }

        return {
          id: docSnap.id,
          name: data.name,
          type: data.type || "Other",
          status: data.status || "AVAILABLE",
          brandId: data.brandId,
          categoryId: data.categoryId,
          brand: brand || { id: '', name: 'Unknown Brand' },
          category: category || { id: '', name: 'Unknown Category' },
          imageUrl: data.imageUrl || '',
          image: data.image,
          shortDescription: data.shortDescription,
          description: data.description,
          inStock: data.inStock || 0,
          quantity: data.quantity || 0,
          price: data.price || data.salePrice || 0,
          salePrice: data.salePrice || 0,
          purchasePrice: data.purchasePrice,
          sellingPrice: data.sellingPrice,
          wholesalePrice: data.wholesalePrice,
          leasePrice: data.leasePrice || 0,
          hourlyRate: data.hourlyRate || 0,
          dailyRate: data.dailyRate || 0,
          weeklyRate: data.weeklyRate || 0,
          condition: data.condition || '',
          leaseTerm: data.leaseTerm || '',
          forSale: data.forSale || false,
          forLease: data.forLease || false,
        } as Equipment;
      }

      const equipmentQuery = query(
        collection(db, EQUIPMENT_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(equipmentQuery);
        
      // Get all categories and brands first
      const categories = await this.getCategories();
      const brands = await this.getBrands();
          
      // Create lookup maps for better performance
      const categoryMap = new Map(categories.map(c => [c.id, c]));
      const brandMap = new Map(brands.map(b => [b.id, b]));

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const category = categoryMap.get(data.categoryId);
        const brand = brandMap.get(data.brandId);
        
        return {
          id: doc.id,
          name: data.name,
          type: data.type || "Other",
          status: data.status || "AVAILABLE",
          brandId: data.brandId,
          categoryId: data.categoryId,
          brand: brand || { id: '', name: 'Unknown Brand' },
          category: category || { id: '', name: 'Unknown Category' },
          imageUrl: data.imageUrl || '',
          image: data.image,
          shortDescription: data.shortDescription,
          description: data.description,
          inStock: data.inStock || 0,
          quantity: data.quantity || 0,
          price: data.price || data.salePrice || 0,
          salePrice: data.salePrice || 0,
          purchasePrice: data.purchasePrice,
          sellingPrice: data.sellingPrice,
          wholesalePrice: data.wholesalePrice,
          leasePrice: data.leasePrice || 0,
          hourlyRate: data.hourlyRate || 0,
          dailyRate: data.dailyRate || 0,
          weeklyRate: data.weeklyRate || 0,
          condition: data.condition || '',
          leaseTerm: data.leaseTerm || '',
          forSale: data.forSale || false,
          forLease: data.forLease || false,
        } as Equipment;
      });
    } catch (error) {
      console.error("Error getting equipment:", error);
      throw new Error("Failed to fetch equipment");
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
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        brandId: data.brandId || data.brand?.id,
        categoryId: data.categoryId || data.category?.id,
        image: imageUrl || data.imageUrl,
        quantity: data.quantity || 0,
        salePrice: data.salePrice || 0,
        wholesalePrice: data.wholesalePrice || 0,
        hourlyRate: data.hourlyRate || 0,
        dailyRate: data.dailyRate || 0,
        weeklyRate: data.weeklyRate || 0,
        forSale: data.forSale ?? false,
        forLease: data.forLease ?? false,
        condition: data.condition || '',
        leaseTerm: data.leaseTerm || '',
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
        if (currentData.image) {
          try {
            const oldImageRef = ref(storage, currentData.image);
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
        name: data.name,
        brandId: data.brandId,
        categoryId: data.categoryId,
        image: imageUrl || data.imageUrl,
        shortDescription: data.shortDescription,
        description: data.description,
        quantity: data.quantity,
        salePrice: data.salePrice ?? 0,
        wholesalePrice: data.wholesalePrice ?? 0,
        hourlyRate: data.hourlyRate ?? 0,
        dailyRate: data.dailyRate ?? 0,
        weeklyRate: data.weeklyRate ?? 0,
        forSale: data.forSale,
        forLease: data.forLease,
        condition: data.condition,
        leaseTerm: data.leaseTerm,
        updatedAt: serverTimestamp(),
      };

      console.log('Update data before saving:', updateData);

      // Only remove undefined values, keep 0s and other falsy values
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

      console.log('Final cleaned data being saved:', cleanedData);

      await updateDoc(docRef, cleanedData);
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
      if (docSnap.data().image) {
        const imageRef = ref(storage, docSnap.data().image);
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
      const brandQuery = query(
        collection(db, BRAND_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(brandQuery);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
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

  async uploadImage(file: File): Promise<string> {
    try {
      const storageRef = ref(storage, `equipment/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  },
}; 