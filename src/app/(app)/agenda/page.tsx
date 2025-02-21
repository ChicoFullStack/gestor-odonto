'use client'

import { Card } from '@/components/ui/card'
import { Calendar, Phone, Clock, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Profissional {
  id: string
  nome: string
}

interface Agendamento {
  id: string
  data: string
  horaInicio: string
  procedimento: string
  status: string
  paciente: {
    nome: string
    telefone: string
  }
  profissional: {
    nome: string
  }
}

export default function AgendaDia() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState('')

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        console.log('Buscando profissionais...')
        const response = await api.get('/profissionais/lista')
        console.log('Resposta da API:', response.data)
        setProfissionais(response.data)
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error)
      }
    }

    fetchProfissionais()
  }, [])

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/agendamentos/hoje')
        setAgendamentos(response.data)
      } catch (error) {
        console.error('Erro ao carregar agenda:', error)
        setError('Erro ao carregar agenda do dia')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgendamentos()
  }, [])

  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    const matchBusca = agendamento.paciente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      agendamento.procedimento.toLowerCase().includes(busca.toLowerCase())
    const matchProfissional = !profissionalSelecionado || 
                            agendamento.profissional.nome === profissionalSelecionado
    const matchStatus = !statusSelecionado || 
                       agendamento.status === statusSelecionado

    return matchBusca && matchProfissional && matchStatus
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Agenda do Dia</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </span>
          <Calendar className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar agendamentos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <select
          value={statusSelecionado}
          onChange={(e) => setStatusSelecionado(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Todos os Status</option>
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <select
          value={profissionalSelecionado}
          onChange={(e) => {
            console.log('Profissional selecionado:', e.target.value)
            setProfissionalSelecionado(e.target.value)
          }}
          className="px-4 py-2 border rounded-lg min-w-[200px]"
        >
          <option value="">Todos os Profissionais</option>
          {profissionais && profissionais.length > 0 ? (
            profissionais.map(profissional => (
              <option key={profissional.id} value={profissional.nome}>
                Dr(a). {profissional.nome}
              </option>
            ))
          ) : (
            <option disabled>Carregando profissionais...</option>
          )}
        </select>
      </div>

      <div className="grid gap-4">
        {agendamentosFiltrados.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-gray-500">
              Nenhum agendamento encontrado
            </p>
          </Card>
        ) : (
          agendamentosFiltrados.map(agendamento => (
            <Card key={agendamento.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      {agendamento.paciente.nome}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        agendamento.status === 'concluido'
                          ? 'bg-green-100 text-green-800'
                          : agendamento.status === 'cancelado'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600">{agendamento.procedimento}</p>
                  
                  <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(agendamento.horaInicio).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{agendamento.paciente.telefone}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    Dr(a). {agendamento.profissional.nome}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    onClick={() => {/* Implementar edição */}}
                  >
                    Editar
                  </button>
                  <button 
                    className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                    onClick={() => {/* Implementar conclusão */}}
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 