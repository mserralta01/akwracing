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
          brand: brand || { id: '', name: 'Unknown Brand' },
          category: category || { id: '', name: 'Unknown Category' },
          image: data.image,
          salePrice: data.salePrice,
          forSale: data.forSale,
          forLease: data.forLease,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as Equipment;
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
        brand: brand || { id: '', name: 'Unknown Brand' },
        category: category || { id: '', name: 'Unknown Category' },
        image: data.image,
        salePrice: data.salePrice,
        forSale: data.forSale,
        forLease: data.forLease,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as Equipment;
    } catch (error) {
      console.error("Error getting equipment by ID:", error);
      throw new Error("Failed to fetch equipment by ID");
    }
  },

  async createEquipment(data: Partial<Equipment>, image?: File): Promise<string> {
    try {
      let imageUrl = undefined;
      if (image) {
        const storageRef = ref(storage, `equipment/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, EQUIPMENT_COLLECTION), {
        ...data,
        image: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating equipment:", error);
      throw new Error("Failed to create equipment");
    }
  },

  async updateEquipment(id: string, data: Partial<Equipment>, image?: File): Promise<void> {
    try {
      const docRef = doc(db, EQUIPMENT_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Equipment not found");

      let imageUrl = data.image;
      if (image) {
        // Delete old image if it exists
        if (docSnap.data().image) {
          try {
            const oldImageRef = ref(storage, docSnap.data().image);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.warn("Error deleting old image:", error);
          }
        }

        // Upload new image
        const storageRef = ref(storage, `equipment/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      } else if (imageUrl === undefined) {
        // If no new image and no image in data, preserve the existing image
        imageUrl = docSnap.data().image;
      }

      const updateData: Record<string, any> = {
        ...data,
        image: imageUrl,
        updatedAt: serverTimestamp(),
      };

      // Remove undefined values to prevent Firestore errors
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

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
}; 