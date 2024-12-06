import { useEffect, useState } from 'react'
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
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

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      return userCredential.user
    } catch (error) {
      throw error
    }
  }

  return {
    user: authState.user,
    loading: authState.loading,
    isAuthenticated: !!authState.user,
    signIn,
    signInWithGoogle,
  }
} 