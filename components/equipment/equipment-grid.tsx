import { Button } from "@/components/ui/button"
import { Edit, Trash2, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Equipment } from "@/types/equipment"
import { useState } from "react"
import { cn } from "@/lib/utils"

type EquipmentGridProps = {
  equipment: Equipment[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function EquipmentGrid({ equipment, onEdit, onDelete }: EquipmentGridProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})
  const [imageErrorStates, setImageErrorStates] = useState<Record<string, boolean>>({})

  const handleImageLoad = (id: string) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }))
  }

  const handleImageError = (id: string) => {
    setImageErrorStates(prev => ({ ...prev, [id]: true }))
    setImageLoadingStates(prev => ({ ...prev, [id]: false }))
  }

  const hasValidImage = (imageUrl?: string) => {
    return imageUrl && imageUrl.trim() !== "" && !imageUrl.startsWith("undefined")
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {equipment.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="aspect-[4/3] relative mb-4 bg-gray-100 rounded-md overflow-hidden">
              {hasValidImage(item.imageUrl) && !imageErrorStates[item.id] ? (
                <>
                  {imageLoadingStates[item.id] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  )}
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className={cn(
                      "object-cover transition-opacity duration-300",
                      imageLoadingStates[item.id] ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => handleImageLoad(item.id)}
                    onError={() => handleImageError(item.id)}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-1">{item.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {[
                  item.brand?.name,
                  item.category?.name
                ].filter(Boolean).join(' - ')}
              </p>
              {item.salePrice && (
                <p className="font-medium text-lg">
                  ${typeof item.salePrice === 'number' 
                    ? item.salePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : item.salePrice}
                </p>
              )}
              <p className="text-sm text-gray-600">
                {[
                  item.forSale && 'For Sale',
                  item.forLease && 'For Lease'
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 p-4 pt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(item.id)}
              className="hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 