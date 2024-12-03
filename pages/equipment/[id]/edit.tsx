import { useRouter } from "next/router"
import { EquipmentForm } from "@/components/equipment/equipment-form"

export default function EditEquipmentPage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Equipment</h1>
      <EquipmentForm equipmentId={id as string} />
    </div>
  )
} 