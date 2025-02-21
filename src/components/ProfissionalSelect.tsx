'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Profissional {
  id: string
  nome: string
}

interface ProfissionalSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ProfissionalSelect({ value, onChange, className }: ProfissionalSelectProps) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfissionais() {
      try {
        const response = await api.get('/profissionais')
        setProfissionais(response.data.profissionais)
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfissionais()
  }, [])

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      disabled={isLoading}
    >
      <option value="">Todos os Profissionais</option>
      {isLoading ? (
        <option disabled>Carregando...</option>
      ) : (
        profissionais.map((profissional) => (
          <option key={profissional.id} value={profissional.id}>
            Dr(a). {profissional.nome}
          </option>
        ))
      )}
    </select>
  )
} 