'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface User {
  id: string
  nome: string
  email: string
}

interface AuthContextData {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const token = Cookies.get('token')
    const savedUser = Cookies.get('user')

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      api.defaults.headers.Authorization = `Bearer ${token}`
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth', {
        email,
        password,
      })

      const { token, user } = response.data

      Cookies.set('token', token)
      Cookies.set('user', JSON.stringify(user))
      
      api.defaults.headers.Authorization = `Bearer ${token}`
      setUser(user)

      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    }
  }

  function signOut() {
    Cookies.remove('token')
    Cookies.remove('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 