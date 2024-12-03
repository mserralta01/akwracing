import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
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

type Equipment = {
  id: string
  name: string
  brand: string
  category: string
  image: string
  salePrice?: number
  forSale: boolean
  forLease: boolean
}

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
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.salePrice ? `$${item.salePrice}` : '-'}</TableCell>
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