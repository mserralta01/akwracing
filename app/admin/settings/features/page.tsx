'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

type Features = {
  ecommerce: boolean
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Features>({ ecommerce: false })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const featuresDoc = await getDoc(doc(db, 'settings', 'features'))
        if (featuresDoc.exists()) {
          setFeatures(featuresDoc.data() as Features)
        }
      } catch (error) {
        console.error('Error loading features:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load features settings'
        })
      } finally {
        setLoading(false)
      }
    }

    loadFeatures()
  }, [toast])

  const handleFeatureToggle = async (feature: keyof Features) => {
    try {
      const newFeatures = { ...features, [feature]: !features[feature] }
      await setDoc(doc(db, 'settings', 'features'), newFeatures)
      setFeatures(newFeatures)
      toast({
        description: `${feature.charAt(0).toUpperCase() + feature.slice(1)} has been ${newFeatures[feature] ? 'enabled' : 'disabled'}`
      })
    } catch (error) {
      console.error('Error updating feature:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update feature'
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Features</h1>
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>Enable or disable specific features of the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1">
              <Label htmlFor="ecommerce">E-commerce</Label>
              <p className="text-sm text-muted-foreground">
                Enable equipment management, orders, and e-commerce features
              </p>
            </div>
            <Switch
              id="ecommerce"
              checked={features.ecommerce}
              onCheckedChange={() => handleFeatureToggle('ecommerce')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 