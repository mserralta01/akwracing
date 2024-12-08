import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { EquipmentForm } from "@/components/equipment/equipment-form"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Category, Brand } from "@/types/equipment"

export default function NewEquipmentPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const categoriesSnapshot = await getDocs(collection(db, "categories"))
      const brandsSnapshot = await getDocs(collection(db, "brands"))

      setCategories(
        categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[]
      )

      setBrands(
        brandsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Brand[]
      )
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    router.push("/admin/equipment")
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
  )
} 