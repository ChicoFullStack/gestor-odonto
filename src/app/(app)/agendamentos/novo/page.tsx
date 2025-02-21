'use client'

import { Card } from '@/components/ui/card'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { useAgendamentoForm } from '@/hooks/useAgendamentoForm'

interface Agendamento {
  pacienteId: string
  profissionalId: string
  data: string
  horaInicio: string
  horaFim: string
  procedimento: string
  observacoes: string
}

export default function NovoAgendamento() {
  const router = useRouter()
  const { pacientes, profissionais, isLoading: isLoadingDados, error: errorDados } = useAgendamentoForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agendamento, setAgendamento] = useState<Agendamento>({
    pacienteId: '',
    profissionalId: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    procedimento: '',
    observacoes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = Cookies.get('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Converter as strings de data e hora para o formato ISO
      const [ano, mes, dia] = agendamento.data.split('-')
      const dataBase = new Date(Number(ano), Number(mes) - 1, Number(dia))
      
      const dadosAgendamento = {
        ...agendamento,
        data: dataBase.toISOString(),
        horaInicio: new Date(dataBase.setHours(
          Number(agendamento.horaInicio.split(':')[0]),
          Number(agendamento.horaInicio.split(':')[1])
        )).toISOString(),
        horaFim: new Date(dataBase.setHours(
          Number(agendamento.horaFim.split(':')[0]),
          Number(agendamento.horaFim.split(':')[1])
        )).toISOString()
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosAgendamento),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar agendamento')
      }

      router.push('/agendamentos')
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      setError('Ocorreu um erro ao criar o agendamento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAgendamento(prev => ({ ...prev, [name]: value }))
  }

  if (errorDados || error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/agendamentos"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
        </div>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>{errorDados || error}</p>
          </div>
          <div className="mt-4">
            <Link
              href="/agendamentos"
              className="text-blue-600 hover:text-blue-800"
            >
              Voltar para lista de agendamentos
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (isLoadingDados) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/agendamentos"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
          <p className="text-gray-500">Preencha as informações para criar um novo agendamento</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente
              </label>
              <select
                name="pacienteId"
                value={agendamento.pacienteId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o paciente</option>
                {pacientes.map(paciente => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nome} - CPF: {paciente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')} 
                    {paciente.telefone && ` - Tel: ${paciente.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profissional
              </label>
              <select
                name="profissionalId"
                value={agendamento.profissionalId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o profissional</option>
                {profissionais.map(profissional => (
                  <option key={profissional.id} value={profissional.id}>
                    {profissional.nome} - CRO: {profissional.cro} ({profissional.especialidade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                name="data"
                value={agendamento.data}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Procedimento
              </label>
              <input
                type="text"
                name="procedimento"
                value={agendamento.procedimento}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Início
              </label>
              <input
                type="time"
                name="horaInicio"
                value={agendamento.horaInicio}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Fim
              </label>
              <input
                type="time"
                name="horaFim"
                value={agendamento.horaFim}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={agendamento.observacoes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/agendamentos"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Criando...' : 'Criar Agendamento'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}