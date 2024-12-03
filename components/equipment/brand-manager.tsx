import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Brand } from "@/types/equipment"
import { useToast } from "@/components/ui/use-toast"
import { Settings } from "lucide-react"

type BrandManagerProps = {
  brands: Brand[]
  onAdd: (name: string) => Promise<void>
  onEdit: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function BrandManager({ brands, onAdd, onEdit, onDelete }: BrandManagerProps) {
  const [newBrand, setNewBrand] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const { toast } = useToast()

  const handleAdd = async () => {
    if (!newBrand.trim()) {
      toast({
        variant: "destructive",
        description: "Brand name cannot be empty",
      })
      return
    }

    try {
      await onAdd(newBrand)
      setNewBrand('')
      toast({
        description: "Brand added successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to add brand",
      })
    }
  }

  const handleEdit = async () => {
    if (!editingName.trim()) {
      toast({
        variant: "destructive",
        description: "Brand name cannot be empty",
      })
      return
    }

    try {
      if (editingId) {
        await onEdit(editingId, editingName)
      }
      setEditingId(null)
      setEditingName('')
      toast({
        description: "Brand updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update brand",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id)
      toast({
        description: "Brand deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete brand",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Manage Brands
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Brands</DialogTitle>
          <DialogDescription>
            Add, edit, or remove brands from your equipment catalog.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New brand name"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center gap-2">
                {editingId === brand.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <Button onClick={handleEdit}>Save</Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null)
                        setEditingName('')
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{brand.name}</span>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingId(brand.id)
                        setEditingName(brand.name)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(brand.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => {}}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 