import { ManageBrands } from "@/components/brands/manage-brands"
// or
import { ManageCategories } from "@/components/categories/manage-categories"

export default function YourPage() {
  return (
    <ManageBrands
      brands={yourBrandsArray}
      onAdd={(name) => {
        // Your add logic
      }}
      onEdit={(oldName, newName) => {
        // Your edit logic
      }}
      onDelete={(name) => {
        // Your delete logic
      }}
      onClose={() => {
        // Your close logic
      }}
    />
  )
} 