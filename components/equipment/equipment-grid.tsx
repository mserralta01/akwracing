import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Equipment } from "@/types/equipment"

type EquipmentGridProps = {
  equipment: Equipment[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function EquipmentGrid({ equipment, onEdit, onDelete }: EquipmentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipment.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="aspect-square relative mb-4">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="rounded-md object-cover"
              />
            </div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.brand} - {item.category}</p>
            {item.salePrice && <p className="font-medium">${item.salePrice}</p>}
            <p className="text-sm">
              {[
                item.forSale && 'For Sale',
                item.forLease && 'For Lease'
              ].filter(Boolean).join(', ')}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(item.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 