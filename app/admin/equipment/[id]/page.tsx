'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import EquipmentFormClient from './equipment-form'
import { Loader2 } from 'lucide-react'

export default function EquipmentPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <div className="h-full">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        <EquipmentFormClient id={id} />
      </Suspense>
    </div>
  )
} 