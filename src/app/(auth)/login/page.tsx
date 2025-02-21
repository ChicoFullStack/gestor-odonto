'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Activity } from 'lucide-react'

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: '#f9fafb'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f3f4f6'
  },
  cardContent: {
    padding: '2rem'
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '2rem'
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    backgroundColor: '#dbeafe',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.25rem'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '0.875rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.375rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '0.625rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    outline: 'none',
    transition: 'all 0.2s',
    fontSize: '0.875rem',
    color: '#1f2937'
  },
  button: {
    width: '100%',
    padding: '0.625rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  forgotPassword: {
    marginTop: '1.5rem',
    textAlign: 'center' as const
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '0.875rem'
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    color: '#6b7280'
  }
}

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardContent}>
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <Activity style={{ width: 24, height: 24, color: '#2563eb' }} />
            </div>
            <h1 style={styles.title}>Gestor Odonto</h1>
            <p style={{ fontSize: '1rem', color: '#6b7280', textAlign: 'center' as const }}>
              Sistema de Gestão para Clínicas Odontológicas
            </p>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <p style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' as const }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={styles.forgotPassword}>
            <a href="#" style={styles.link}>
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      </div>

      
    </div>
  )
} 