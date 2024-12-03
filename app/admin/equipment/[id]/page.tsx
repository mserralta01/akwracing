'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import EquipmentFormClient from './equipment-form'

export default function EquipmentPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <div className="h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <EquipmentFormClient id={id} />
      </Suspense>
    </div>
  )
} 