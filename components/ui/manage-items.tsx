import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useState } from "react"

type ManageItemsProps = {
  title: string
  description: string
  items: string[]
  onAdd: (name: string) => void
  onEdit: (oldName: string, newName: string) => void
  onDelete: (name: string) => void
  onClose: () => void
}

export function ManageItems({
  title,
  description,
  items,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}: ManageItemsProps) {
  const [newItemName, setNewItemName] = useState("")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim())
      setNewItemName("")
    }
  }

  const startEdit = (item: string) => {
    setEditingItem(item)
    setEditValue(item)
  }

  const handleEdit = (oldName: string) => {
    if (editValue.trim() && editValue !== oldName) {
      onEdit(oldName, editValue.trim())
    }
    setEditingItem(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-500">{description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder={`New ${title.toLowerCase()} name`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>

        <div className="border rounded-lg">
          <div className="grid grid-cols-[1fr,200px] gap-4 p-3 bg-gray-50 font-medium border-b">
            <div>Name</div>
            <div>Actions</div>
          </div>
          
          {items.map((item) => (
            <div
              key={item}
              className="grid grid-cols-[1fr,200px] gap-4 p-3 border-b last:border-b-0 items-center"
            >
              {editingItem === item ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEdit(item)}
                  autoFocus
                />
              ) : (
                <span>{item}</span>
              )}
              <div className="flex gap-2">
                {editingItem === item ? (
                  <>
                    <Button size="sm" onClick={() => handleEdit(item)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingItem(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(item)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 