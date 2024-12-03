import { useState, useEffect } from "react"
import { ViewToggle } from "@/components/equipment/view-toggle"
import { EquipmentTable } from "@/components/equipment/equipment-table"
import { EquipmentGrid } from "@/components/equipment/equipment-grid"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { useRouter } from "next/router"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Equipment } from "@/types/equipment"

type ViewMode = 'grid' | 'table'
type Filters = {
  forSale: boolean
  forLease: boolean
}

export default function EquipmentPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<Filters>({
    forSale: false,
    forLease: false,
  })
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
  const { toast } = useToast()
  const router = useRouter()

  console.log("Current path:", router.pathname)
  console.log("Current asPath:", router.asPath)

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "equipment"))
        const equipmentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Equipment[]
        setEquipmentList(equipmentData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load equipment. Please try again.",
          variant: "destructive"
        })
      }
    }

    loadEquipment()
  }, [toast])

  const handleEdit = (id: string) => {
    router.push(`/equipment/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "equipment", id))
      setEquipmentList(equipmentList.filter(item => item.id !== id))
      toast({
        title: "Equipment deleted",
        description: "The equipment has been successfully removed."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete equipment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const filteredEquipment = equipmentList.filter(item => {
    if (!filters.forSale && !filters.forLease) return true
    return (
      (filters.forSale && item.forSale) ||
      (filters.forLease && item.forLease)
    )
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipment</h1>
        <Link href="/equipment/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sale-filter"
                checked={filters.forSale}
                onCheckedChange={(checked) => 
                  setFilters(f => ({ ...f, forSale: checked as boolean }))
                }
              />
              <label htmlFor="sale-filter">For Sale</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lease-filter"
                checked={filters.forLease}
                onCheckedChange={(checked) => 
                  setFilters(f => ({ ...f, forLease: checked as boolean }))
                }
              />
              <label htmlFor="lease-filter">For Lease</label>
            </div>
          </div>
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {viewMode === 'table' ? (
          <EquipmentTable
            equipment={filteredEquipment}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <EquipmentGrid
            equipment={filteredEquipment}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
} 