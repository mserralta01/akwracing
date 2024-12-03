import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { SaleLeaseSwitch } from "@/components/equipment/sale-lease-switch"
import { useToast } from "@/hooks/use-toast"
import { FormInput } from "@/components/ui/form-input"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"

type FormData = {
  name: string
  brand: string
  category: string
  image: string
  salePrice?: number
  leasePrice?: number
  condition?: string
  leaseTerm?: string
  forSale: boolean
  forLease: boolean
}

type EquipmentFormProps = {
  equipmentId?: string
}

export function EquipmentForm({ equipmentId }: EquipmentFormProps) {
  const [forSale, setForSale] = useState(false)
  const [forLease, setForLease] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    brand: "",
    category: "",
    image: "",
    forSale: false,
    forLease: false,
  })
  
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (equipmentId) {
      const loadEquipment = async () => {
        const docRef = doc(db, "equipment", equipmentId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data() as FormData
          setFormData(data)
          setForSale(data.forSale)
          setForLease(data.forLease)
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
    
    if (forSale) {
      const saleValidation = validateSaleSection()
      if (!saleValidation.isValid) {
        toast({
          title: "Validation Error",
          description: saleValidation.message,
          variant: "destructive"
        })
        return
      }
    }

    if (forLease) {
      const leaseValidation = validateLeaseSection()
      if (!leaseValidation.isValid) {
        toast({
          title: "Validation Error",
          description: leaseValidation.message,
          variant: "destructive"
        })
        return
      }
    }
    
    try {
      const finalData = {
        ...formData,
        forSale,
        forLease,
      }

      if (equipmentId) {
        await updateDoc(doc(db, "equipment", equipmentId), finalData)
      } else {
        await setDoc(doc(collection(db, "equipment")), finalData)
      }

      toast({
        title: "Success",
        description: `Equipment ${equipmentId ? "updated" : "added"} successfully`
      })
      
      router.push("/equipment")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save equipment. Please try again.",
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
            <FormInput
              id="image"
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
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