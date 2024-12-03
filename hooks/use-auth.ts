import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

type AuthState = {
  user: User | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false,
      })
    })

    return () => unsubscribe()
  }, [])

  return {
    user: authState.user,
    loading: authState.loading,
    isAuthenticated: !!authState.user,
  }
} 