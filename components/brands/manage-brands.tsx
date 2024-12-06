import { ManageItems } from "@/components/ui/manage-items"

export function ManageBrands({
  brands,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}: {
  brands: string[]
  onAdd: (name: string) => void
  onEdit: (oldName: string, newName: string) => void
  onDelete: (name: string) => void
  onClose: () => void
}) {
  return (
    <ManageItems
      title="Manage Brands"
      description="Add, edit, or remove brands from your equipment catalog."
      items={brands}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onClose={onClose}
    />
  )
} 