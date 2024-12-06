import { useState, useEffect } from "react"

type FileDialogProps = {
  value?: string | null
  onChange: (url: string | null) => void
  initialImage?: string | null
}

export function FileDialog({ value, onChange, initialImage }: FileDialogProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage)
    }
  }, [initialImage])

  // ... rest of the component
} 