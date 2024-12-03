import { useState } from "react"
import { ManageBrands } from "@/components/brands/manage-brands"
import { db } from "@/lib/firebase"
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function BrandsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [brands, setBrands] = useState<string[]>([])
  const { toast } = useToast()

  const handleAdd = async (name: string) => {
    try {
      await addDoc(collection(db, "brands"), { name })
      setBrands([...brands, name])
      toast({ title: "Brand added successfully" })
    } catch (error) {
      toast({ 
        title: "Error adding brand", 
        variant: "destructive" 
      })
    }
  }

  const handleEdit = async (oldName: string, newName: string) => {
    try {
      // Update logic here
      toast({ title: "Brand updated successfully" })
    } catch (error) {
      toast({ 
        title: "Error updating brand", 
        variant: "destructive" 
      })
    }
  }

  const handleDelete = async (name: string) => {
    try {
      // Delete logic here
      setBrands(brands.filter(b => b !== name))
      toast({ title: "Brand deleted successfully" })
    } catch (error) {
      toast({ 
        title: "Error deleting brand", 
        variant: "destructive" 
      })
    }
  }

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Manage Brands</button>
      
      {isOpen && (
        <ManageBrands
          brands={brands}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 