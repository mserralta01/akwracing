import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Equipment } from "@/types/equipment"

type EquipmentTableProps = {
  equipment: Equipment[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function EquipmentTable({ equipment, onEdit, onDelete }: EquipmentTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      toast({
        title: "Equipment deleted",
        description: "The equipment has been successfully deleted."
      })
      setDeleteId(null)
    }
  }

  const hasValidImage = (imageUrl?: string) => {
    return imageUrl && imageUrl.trim() !== "" && !imageUrl.startsWith("undefined")
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sale Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  {hasValidImage(item.image) ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.brand?.name}</TableCell>
              <TableCell>{item.category?.name}</TableCell>
              <TableCell>
                {item.salePrice 
                  ? `$${typeof item.salePrice === 'number' 
                      ? item.salePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.salePrice}`
                  : '-'
                }
              </TableCell>
              <TableCell>
                {[
                  item.forSale && 'For Sale',
                  item.forLease && 'For Lease'
                ].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
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
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the equipment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 