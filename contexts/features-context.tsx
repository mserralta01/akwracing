'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Features = {
  ecommerce: boolean
}

type FeaturesContextType = {
  features: Features
  loading: boolean
}

const FeaturesContext = createContext<FeaturesContextType>({
  features: { ecommerce: false },
  loading: true
})

export function FeaturesProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState<Features>({ ecommerce: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'features'), (doc) => {
      if (doc.exists()) {
        setFeatures(doc.data() as Features)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <FeaturesContext.Provider value={{ features, loading }}>
      {children}
    </FeaturesContext.Provider>
  )
}

export const useFeatures = () => useContext(FeaturesContext) 