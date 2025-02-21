'use client'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { ArrowLeft, Plus, AlertCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Odontograma } from '@/components/Odontograma'
import { ExcluirProntuarioModal } from '@/components/modals/ExcluirProntuarioModal'

interface Prontuario {
  id: string
  data: string
  descricao: string
  procedimento: string
  observacoes: string | null
}

interface Paciente {
  id: string
  nome: string
  avatarUrl: string | null
}

export default function ProntuarioPaciente() {
  const { id } = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([])
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    descricao: '',
    procedimento: '',
    observacoes: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [modalExcluirOpen, setModalExcluirOpen] = useState(false)
  const [selectedProntuarioId, setSelectedProntuarioId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const token = Cookies.get('token')
        if (!token) {
          router.push('/login')
          return
        }

        // Buscar dados do paciente
        const pacienteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!pacienteResponse.ok) {
          throw new Error('Erro ao carregar dados do paciente')
        }

        const pacienteData = await pacienteResponse.json()
        setPaciente(pacienteData)

        // Buscar prontuários
        const prontuariosResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prontuarios/paciente/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!prontuariosResponse.ok) {
          throw new Error('Erro ao carregar prontuários')
        }

        const prontuariosData = await prontuariosResponse.json()
        setProntuarios(prontuariosData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setError('Ocorreu um erro ao carregar os dados')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const token = Cookies.get('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prontuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pacienteId: id,
          ...formData
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar prontuário')
      }

      const novoProntuario = await response.json()
      setProntuarios(prev => [novoProntuario, ...prev])
      setShowForm(false)
      setFormData({
        descricao: '',
        procedimento: '',
        observacoes: ''
      })
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error)
      setError('Ocorreu um erro ao salvar o prontuário')
    } finally {
      setIsSaving(false)
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExcluir = (prontuarioId: string) => {
    setSelectedProntuarioId(prontuarioId)
    setModalExcluirOpen(true)
  }

  const handleConfirmExcluir = async () => {
    if (!selectedProntuarioId) return

    try {
      setIsDeleting(true)
      const token = Cookies.get('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prontuarios/${selectedProntuarioId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir prontuário')
      }

      // Atualizar a lista de prontuários
      setProntuarios(prev => prev.filter(prontuario => prontuario.id !== selectedProntuarioId))
      setModalExcluirOpen(false)
    } catch (error) {
      console.error('Erro ao excluir prontuário:', error)
      setError('Ocorreu um erro ao excluir o prontuário')
    } finally {
      setIsDeleting(false)
      setSelectedProntuarioId(null)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/pacientes/${id}`}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Prontuário do Paciente</h1>
        </div>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <Link
              href={`/pacientes/${id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Voltar para detalhes do paciente
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (isLoading) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/pacientes/${id}`}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-4">
            {paciente && (
              <Avatar
                src={paciente.avatarUrl}
                alt={paciente.nome}
                name={paciente.nome}
                size="lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prontuário do Paciente</h1>
              {paciente && (
                <p className="text-gray-500">{paciente.nome}</p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Novo Registro
        </button>
      </div>

      {/* Formulário de Novo Registro */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Novo Registro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Procedimento
              </label>
              <input
                type="text"
                value={formData.procedimento}
                onChange={(e) => setFormData(prev => ({ ...prev, procedimento: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Odontograma */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Odontograma do Paciente</h2>
        <Odontograma pacienteId={id as string} prontuarioId={prontuarios[0]?.id} />
      </Card>

      {/* Lista de Registros */}
      <div className="space-y-4">
        {prontuarios.length > 0 ? (
          prontuarios.map((prontuario) => (
            <Card key={prontuario.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{prontuario.procedimento}</h3>
                  <p className="text-sm text-gray-500">{formatarData(prontuario.data)}</p>
                </div>
                <button
                  onClick={() => handleExcluir(prontuario.id)}
                  className="text-red-600 hover:text-red-800"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Descrição</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{prontuario.descricao}</p>
                </div>
                {prontuario.observacoes && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Observações</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{prontuario.observacoes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6">
            <p className="text-center text-gray-500">Nenhum registro encontrado no prontuário</p>
          </Card>
        )}
      </div>

      {/* Modal de Exclusão */}
      <ExcluirProntuarioModal
        isOpen={modalExcluirOpen}
        onClose={() => setModalExcluirOpen(false)}
        onConfirm={handleConfirmExcluir}
        isDeleting={isDeleting}
      />
    </div>
  )
}