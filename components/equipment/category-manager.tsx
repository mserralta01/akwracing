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
import { Category } from "@/types/equipment"
import { useToast } from "@/components/ui/use-toast"
import { Settings } from "lucide-react"

type CategoryManagerProps = {
  categories: Category[]
  onAdd: (name: string) => Promise<void>
  onEdit: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function CategoryManager({
  categories,
  onAdd,
  onEdit,
  onDelete,
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const { toast } = useToast()

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast({
        variant: "destructive",
        description: "Category name cannot be empty",
      })
      return
    }

    try {
      await onAdd(newCategory)
      setNewCategory('')
      toast({
        description: "Category added successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to add category",
      })
    }
  }

  const handleEdit = async () => {
    if (!editingName.trim()) {
      toast({
        variant: "destructive",
        description: "Category name cannot be empty",
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
        description: "Category updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update category",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id)
      toast({
        description: "Category deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete category",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add, edit, or remove categories from your equipment catalog.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                {editingId === category.id ? (
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
                    <span className="flex-1">{category.name}</span>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingId(category.id)
                        setEditingName(category.name)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(category.id)}
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