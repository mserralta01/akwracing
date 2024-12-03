import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { SaleLeaseSwitch } from "@/components/equipment/sale-lease-switch"
import { useToast } from "@/hooks/use-toast"
import { FormInput } from "@/components/ui/form-input"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { Equipment } from "@/types/equipment"
import { equipmentService } from "@/lib/services/equipment-service"

type FormData = {
  name: string
  brand: string
  category: string
  imageUrl: string
  salePrice?: number
  leasePrice?: number
  condition?: string
  leaseTerm?: string
  forSale: boolean
  forLease: boolean
  hourlyRate?: number
  dailyRate?: number
  weeklyRate?: number
}

type EquipmentFormProps = {
  equipmentId?: string
  initialData?: Equipment
}

export type PreloadedFile = {
  preview: string;
  name: string;
  size: number;
  type: string;
}

export function EquipmentForm({ equipmentId, initialData }: EquipmentFormProps) {
  const [forSale, setForSale] = useState(initialData?.forSale || false)
  const [forLease, setForLease] = useState(initialData?.forLease || false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    brand: "",
    category: "",
    imageUrl: "",
    salePrice: 0,
    leasePrice: 0,
    hourlyRate: 0,
    dailyRate: 0,
    weeklyRate: 0,
    condition: "",
    leaseTerm: "",
    forSale: false,
    forLease: false,
  })
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [preloadedImage, setPreloadedImage] = useState<PreloadedFile | null>(null);

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (equipmentId) {
      const loadEquipment = async () => {
        const docRef = doc(db, "equipment", equipmentId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const equipmentData = docSnap.data() as Equipment
          setFormData({
            name: equipmentData.name || "",
            brand: equipmentData.brand || "",
            category: equipmentData.category || "",
            imageUrl: equipmentData.imageUrl || "",
            salePrice: equipmentData.salePrice || 0,
            leasePrice: equipmentData.leasePrice || 0,
            hourlyRate: equipmentData.hourlyRate || 0,
            dailyRate: equipmentData.dailyRate || 0,
            weeklyRate: equipmentData.weeklyRate || 0,
            condition: equipmentData.condition || "",
            leaseTerm: equipmentData.leaseTerm || "",
            forSale: equipmentData.forSale || false,
            forLease: equipmentData.forLease || false,
          })
          setForSale(equipmentData.forSale)
          setForLease(equipmentData.forLease)
          
          if (equipmentData.imageUrl) {
            setPreloadedImage({
              preview: equipmentData.imageUrl,
              name: equipmentData.imageUrl.split('/').pop() || 'current-image',
              size: 0,
              type: 'image/*'
            });
          }
        }
      }
      loadEquipment()
    }
  }, [equipmentId])

  const validateSaleSection = () => {
    if (forSale && (!formData.salePrice || !formData.condition)) {
      return {
        isValid: false,
        message: "Please complete sale price and condition"
      }
    }
    return { isValid: true, message: "" }
  }

  const validateLeaseSection = () => {
    if (forLease && (!formData.leasePrice || !formData.leaseTerm)) {
      return {
        isValid: false,
        message: "Please complete lease price and lease term"
      }
    }
    return { isValid: true, message: "" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const finalData: Partial<Equipment> = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        imageUrl: formData.imageUrl,
        forSale: forSale,
        forLease: forLease,
        // Sale related fields
        salePrice: forSale ? formData.salePrice : 0,
        condition: forSale ? formData.condition : "",
        // Lease related fields
        leasePrice: forLease ? formData.leasePrice : 0,
        leaseTerm: forLease ? formData.leaseTerm : "",
        hourlyRate: forLease ? formData.hourlyRate : 0,
        dailyRate: forLease ? formData.dailyRate : 0,
        weeklyRate: forLease ? formData.weeklyRate : 0,
      }

      if (equipmentId) {
        await equipmentService.updateEquipment(equipmentId, finalData)
      } else {
        await equipmentService.createEquipment(finalData)
      }

      toast({
        title: "Success",
        description: `Equipment ${equipmentId ? "updated" : "added"} successfully`
      })
      
      router.push("/admin/equipment")
    } catch (error) {
      console.error('Error saving equipment:', error)
      toast({
        title: "Error",
        description: "Failed to save equipment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      setFormData({ ...formData, imageUrl: "" })
      return
    }

    try {
      // Here you should implement your actual image upload logic
      // This might involve uploading to Firebase Storage or another service
      const uploadedUrl = await uploadImageToStorage(file) // You'll need to implement this
      setFormData({ ...formData, imageUrl: uploadedUrl })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <FormInput
              id="name"
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormInput
              id="brand"
              label="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            />
            <FormInput
              id="category"
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <ImageUpload 
              onChange={handleImageUpload}
              preloadedImage={preloadedImage}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <SaleLeaseSwitch
                type="sale"
                isEnabled={forSale}
                onChange={setForSale}
                onValidate={validateSaleSection}
              />
              
              {forSale && (
                <div className="mt-4 space-y-4">
                  <FormInput
                    id="salePrice"
                    label="Sale Price"
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    required
                  />
                  <FormInput
                    id="condition"
                    label="Condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>

            <div>
              <SaleLeaseSwitch
                type="lease"
                isEnabled={forLease}
                onChange={setForLease}
                onValidate={validateLeaseSection}
              />
              
              {forLease && (
                <div className="mt-4 space-y-4">
                  <FormInput
                    id="hourlyRate"
                    label="Hourly Rate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                    required
                  />
                  <FormInput
                    id="dailyRate"
                    label="Daily Rate"
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                    required
                  />
                  <FormInput
                    id="weeklyRate"
                    label="Weekly Rate"
                    type="number"
                    value={formData.weeklyRate}
                    onChange={(e) => setFormData({ ...formData, weeklyRate: Number(e.target.value) })}
                    required
                  />
                  <FormInput
                    id="leasePrice"
                    label="Lease Price"
                    type="number"
                    value={formData.leasePrice}
                    onChange={(e) => setFormData({ ...formData, leasePrice: Number(e.target.value) })}
                    required
                  />
                  <FormInput
                    id="leaseTerm"
                    label="Lease Term"
                    value={formData.leaseTerm}
                    onChange={(e) => setFormData({ ...formData, leaseTerm: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push("/admin/equipment")}
        >
          Cancel
        </Button>
        <Button type="submit">
          {equipmentId ? "Update" : "Add"} Equipment
        </Button>
      </div>
    </form>
  )
}

async function uploadImageToStorage(file: File): Promise<string> {
  // Implement your image upload logic here
  // Return the URL of the uploaded image
  throw new Error("Not implemented")
} 