'use client'

import { Card } from '@/components/ui/card'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { CancelarAgendamentoModal } from '@/components/modals/CancelarAgendamentoModal'
import { ExcluirAgendamentoModal } from '@/components/modals/ExcluirAgendamentoModal'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Avatar } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import { ProfissionalSelect } from '@/components/ProfissionalSelect'

interface Agendamento {
  id: string
  data: string
  horaInicio: string
  horaFim: string
  procedimento: string
  status: string
  observacoes: string | null
  paciente: {
    id: string
    nome: string
    telefoneCelular: string
    avatarUrl: string | null
  }
  profissional: {
    id: string
    nome: string
  }
}

interface Profissional {
  id: string
  nome: string
}

export default function Agendamentos() {
  const [modalCancelarOpen, setModalCancelarOpen] = useState(false)
  const [modalExcluirOpen, setModalExcluirOpen] = useState(false)
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState<string | null>(null)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('')
  const [profissionalId, setProfissionalId] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [dataFiltro, setDataFiltro] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusSelecionado, setStatusSelecionado] = useState('')

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const token = Cookies.get('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Erro ao carregar profissionais')

        const data = await response.json()
        setProfissionais(data)
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error)
      }
    }

    fetchProfissionais()
  }, [])

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        setError(null)
        const token = Cookies.get('token')
        if (!token) return

        const queryParams = new URLSearchParams({
          page: pagina.toString(),
          limit: '10'
        })

        if (busca) queryParams.append('busca', busca)
        if (status) queryParams.append('status', status)
        if (profissionalId) queryParams.append('profissionalId', profissionalId)
        if (dataFiltro) queryParams.append('data', dataFiltro)

        const response = await api.get(`/agendamentos?${queryParams}`)
        setAgendamentos(response.data.agendamentos)
        setTotalPaginas(response.data.pages)
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error)
        setError('Ocorreu um erro ao carregar os agendamentos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgendamentos()
  }, [busca, status, profissionalId, pagina, dataFiltro])

  const handleCancelar = (id: string) => {
    setSelectedAgendamentoId(id)
    setModalCancelarOpen(true)
  }

  const handleConfirmCancelar = async () => {
    if (!selectedAgendamentoId) return

    try {
      await api.patch(`/agendamentos/${selectedAgendamentoId}/status`, {
        status: 'cancelado'
      })

      // Atualizar a lista de agendamentos
      setAgendamentos(prev => 
        prev.map(agendamento => 
          agendamento.id === selectedAgendamentoId
            ? { ...agendamento, status: 'cancelado' }
            : agendamento
        )
      )
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error)
    } finally {
      setModalCancelarOpen(false)
      setSelectedAgendamentoId(null)
    }
  }

  const handleExcluir = (id: string) => {
    setSelectedAgendamentoId(id)
    setModalExcluirOpen(true)
  }

  const handleConfirmExcluir = async () => {
    if (!selectedAgendamentoId) return

    try {
      setIsDeleting(true)
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agendamentos/${selectedAgendamentoId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json()
          throw new Error(data.message || 'Não é possível excluir este agendamento')
        }
        throw new Error('Erro ao excluir agendamento')
      }

      // Atualizar a lista de agendamentos
      setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== selectedAgendamentoId))
      setModalExcluirOpen(false)
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      alert(error instanceof Error ? error.message : 'Erro ao excluir agendamento')
    } finally {
      setIsDeleting(false)
      setSelectedAgendamentoId(null)
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      agendado: 'bg-blue-100 text-blue-800',
      confirmado: 'bg-green-100 text-green-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      concluido: 'bg-purple-100 text-purple-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      agendado: 'Agendado',
      confirmado: 'Confirmado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    const matchBusca = agendamento.paciente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      agendamento.procedimento.toLowerCase().includes(busca.toLowerCase())
    const matchProfissional = !profissionalId || agendamento.profissional.id === profissionalId
    const matchStatus = !statusSelecionado || agendamento.status === statusSelecionado
    const matchData = !dataFiltro || agendamento.data.startsWith(dataFiltro)

    return matchBusca && matchProfissional && matchStatus && matchData
  })

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
        <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
        <Link
          href="/agendamentos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Agendamento
        </Link>
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

        <input
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />

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

        <ProfissionalSelect
          value={profissionalId}
          onChange={setProfissionalId}
          className="px-4 py-2 border rounded-lg min-w-[200px]"
        />
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {agendamentosFiltrados.map(agendamento => (
          <Card key={agendamento.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  src={agendamento.paciente.avatarUrl}
                  alt={agendamento.paciente.nome}
                  name={agendamento.paciente.nome}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{agendamento.paciente.nome}</h3>
                  <p className="text-sm text-gray-500">{agendamento.paciente.telefoneCelular}</p>
                </div>
                <div className="ml-6">
                  <p className="font-medium text-gray-900">{formatarData(agendamento.data)}</p>
                  <p className="text-sm text-gray-500">
                    {formatarHora(agendamento.horaInicio)} - {formatarHora(agendamento.horaFim)}
                  </p>
                </div>
                <div className="ml-6">
                  <p className="text-gray-900">{agendamento.procedimento}</p>
                  <p className="text-sm text-gray-500">Dr(a). {agendamento.profissional.nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agendamento.status)}`}>
                  {getStatusText(agendamento.status)}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/agendamentos/${agendamento.id}/editar`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </Link>
                  {agendamento.status !== 'cancelado' && agendamento.status !== 'concluido' && (
                    <>
                      <button
                        onClick={() => handleCancelar(agendamento.id)}
                        className="text-yellow-600 hover:text-yellow-800"
                        disabled={isDeleting}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleExcluir(agendamento.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isDeleting}
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {agendamentosFiltrados.length === 0 && !isLoading && (
          <Card className="p-6">
            <p className="text-center text-gray-500">Nenhum agendamento encontrado</p>
          </Card>
        )}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2">
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      )}

      <CancelarAgendamentoModal
        isOpen={modalCancelarOpen}
        onClose={() => setModalCancelarOpen(false)}
        onConfirm={handleConfirmCancelar}
      />

      <ExcluirAgendamentoModal
        isOpen={modalExcluirOpen}
        onClose={() => setModalExcluirOpen(false)}
        onConfirm={handleConfirmExcluir}
        isDeleting={isDeleting}
      />
    </div>
  )
} 