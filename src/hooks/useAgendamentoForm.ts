'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface Profissional {
  id: string
  nome: string
  especialidade: string
  cro: string
  status: 'ativo' | 'inativo'
}

interface Paciente {
  id: string
  nome: string
  cpf: string
  telefone: string
  status: 'ativo' | 'inativo'
}

export function useAgendamentoForm() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [profissionaisRes, pacientesRes] = await Promise.all([
          api.get('/profissionais'),
          api.get('/pacientes')
        ])

        if (profissionaisRes.data?.profissionais) {
          const profissionaisAtivos = profissionaisRes.data.profissionais.filter(
            (p: Profissional) => p.status === 'ativo'
          )
          setProfissionais(profissionaisAtivos)
        }

        if (pacientesRes.data?.pacientes) {
          // Filtra apenas pacientes ativos
          const pacientesAtivos = pacientesRes.data.pacientes.filter(
            (p: Paciente) => p.status === 'ativo'
          )
          setPacientes(pacientesAtivos)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setError('Erro ao carregar dados necessários')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { profissionais, pacientes, isLoading, error }
} 