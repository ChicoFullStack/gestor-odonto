'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface User {
  id: string
  nome: string
  email: string
  cargo: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {}
})

const COOKIE_OPTIONS = {
  expires: 7, // 7 dias
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário e token nos cookies
    const storedUser = Cookies.get('user')
    const token = Cookies.get('token')

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        // Se houver erro ao carregar o usuário, fazer logout
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login')
      }

      // Salvar token e usuário nos cookies
      Cookies.set('token', data.token, COOKIE_OPTIONS)
      Cookies.set('user', JSON.stringify(data.usuario), COOKIE_OPTIONS)
      setUser(data.usuario)

      // Redirecionar para o dashboard
      router.push('/')
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Remover cookies
    Cookies.remove('token')
    Cookies.remove('user')
    
    // Limpar estado
    setUser(null)
    
    // Redirecionar para login
    router.push('/login')
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 