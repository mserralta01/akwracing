import { ManageItems } from "@/components/ui/manage-items"

export function ManageCategories({
  categories,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}: {
  categories: string[]
  onAdd: (name: string) => void
  onEdit: (oldName: string, newName: string) => void
  onDelete: (name: string) => void
  onClose: () => void
}) {
  return (
    <ManageItems
      title="Manage Categories"
      description="Add, edit, or remove categories from your equipment catalog."
      items={categories}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onClose={onClose}
    />
  )
} 