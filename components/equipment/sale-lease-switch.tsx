import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type SaleLeaseSwitchProps = {
  isEnabled: boolean
  onChange: (enabled: boolean) => void
  type: 'sale' | 'lease'
  onValidate?: () => { isValid: boolean; message: string }
}

export function SaleLeaseSwitch({ isEnabled, onChange, type, onValidate }: SaleLeaseSwitchProps) {
  const { toast } = useToast()

  const handleChange = (checked: boolean) => {
    if (checked && onValidate) {
      const { isValid, message } = onValidate()
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: message,
          variant: "destructive"
        })
        return
      }
    }
    onChange(checked)
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`${type}-switch`}
        checked={isEnabled}
        onCheckedChange={handleChange}
      />
      <Label htmlFor={`${type}-switch`}>
        Available for {type === 'sale' ? 'Sale' : 'Lease'}
      </Label>
    </div>
  )
} 