import { useEffect, useState } from "react"
import { BrandManager as ManageBrands } from "@/components/equipment/brand-manager"
import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { Brand } from "@/types/equipment"

export default function BrandsManagementPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsSnapshot = await getDocs(collection(db, "brands"))
        const brandsData = brandsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt),
          updatedAt: new Date(doc.data().updatedAt || doc.data().createdAt)
        })) as Brand[]
        setBrands(brandsData)
      } catch (error) {
        console.error("Error fetching brands:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const handleAddBrand = async (name: string) => {
    try {
      const now = new Date()
      const docRef = await addDoc(collection(db, "brands"), {
        name,
        createdAt: now,
        updatedAt: now
      })

      setBrands(prev => [...prev, {
        id: docRef.id,
        name,
        createdAt: now,
        updatedAt: now
      }])
    } catch (error) {
      console.error("Error adding brand:", error)
    }
  }

  const handleUpdateBrand = async (id: string, name: string) => {
    try {
      const now = new Date()
      const brandRef = doc(db, "brands", id)
      await updateDoc(brandRef, {
        name,
        updatedAt: now
      })

      setBrands(prev => prev.map(brand => 
        brand.id === id ? { ...brand, name, updatedAt: now } : brand
      ))
    } catch (error) {
      console.error("Error updating brand:", error)
    }
  }

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteDoc(doc(db, "brands", id))
      setBrands(prev => prev.filter(brand => brand.id !== id))
    } catch (error) {
      console.error("Error deleting brand:", error)
    }
  }

  if (loading) {
    return <div className="p-4">Loading brands...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Manage Brands</h1>
      <ManageBrands
        brands={brands}
        onAdd={handleAddBrand}
        onUpdate={handleUpdateBrand}
        onDelete={handleDeleteBrand}
      />
    </div>
  )
} 