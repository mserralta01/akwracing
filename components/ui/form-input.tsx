import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forwardRef } from "react"

type FormInputProps = {
  label: string
} & React.ComponentPropsWithoutRef<typeof Input>

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id}>{label}</Label>
        <Input ref={ref} {...props} />
      </div>
    )
  }
)

FormInput.displayName = "FormInput" 