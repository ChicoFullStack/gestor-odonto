'use client'

import { Card } from '@/components/ui/card'
import { Calendar, DollarSign, Users, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface DashboardData {
  financeiro: {
    receitasMes: {
      total: number
      quantidade: number
    }
    despesasMes: {
      total: number
      quantidade: number
    }
    receitasDia: {
      total: number
      quantidade: number
    }
    saldoMes: number
    lancamentosPendentes: number
  }
  proximosAgendamentos: Array<{
    id: string
    data: string
    horaInicio: string
    procedimento: string
    paciente: {
      nome: string
    }
    profissional: {
      nome: string
    }
  }>
  totalPacientes: number
}

interface Agendamento {
  id: string
  data: string
  horaInicio: string
  horaFim: string
  procedimento: string
  status: string
  paciente: {
    nome: string
    telefoneCelular: string
  }
  profissional: {
    nome: string
  }
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/dashboard')
        setData(response.data)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
        setError('Erro ao carregar dados do dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchAgendamentos = async () => {
      try {
        const response = await api.get('/agendamentos/proximos')
        setAgendamentos(response.data)
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error)
        setError('Erro ao carregar próximos agendamentos')
      }
    }

    fetchData()
    fetchAgendamentos()
  }, [])

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <p className="text-red-600">{error || 'Erro ao carregar dados'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receitas de Hoje</p>
              <p className="text-2xl font-bold text-emerald-600">
                R$ {data.financeiro.receitasDia.total.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {data.financeiro.receitasDia.quantidade} lançamentos
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receitas do Mês</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {data.financeiro.receitasMes.total.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {data.financeiro.receitasMes.quantidade} lançamentos
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Despesas do Mês</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {data.financeiro.despesasMes.total.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {data.financeiro.despesasMes.quantidade} lançamentos
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Pacientes</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.totalPacientes}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lançamentos Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {data.financeiro.lancamentosPendentes}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">Próximos Agendamentos</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profissional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                  </td>
                </tr>
              ) : agendamentos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              ) : (
                agendamentos.map((agendamento) => (
                  <tr key={agendamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {agendamento.paciente.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agendamento.paciente.telefoneCelular}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatarData(agendamento.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatarHora(agendamento.horaInicio)} - {formatarHora(agendamento.horaFim)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agendamento.procedimento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Dr(a). {agendamento.profissional.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        agendamento.status === 'agendado'
                          ? 'bg-blue-100 text-blue-800'
                          : agendamento.status === 'confirmado'
                          ? 'bg-green-100 text-green-800'
                          : agendamento.status === 'em_andamento'
                          ? 'bg-yellow-100 text-yellow-800'
                          : agendamento.status === 'concluido'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
} 