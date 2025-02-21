'use client'

import { Card } from '@/components/ui/card'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

interface Agendamento {
  pacienteId: string
  profissionalId: string
  data: string
  horaInicio: string
  horaFim: string
  procedimento: string
  observacoes: string
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
}

export default function EditarAgendamento() {
  const { id } = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [agendamento, setAgendamento] = useState<Agendamento>({
    pacienteId: '',
    profissionalId: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    procedimento: '',
    observacoes: '',
    status: 'agendado'
  })

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        setError(null)
        const token = Cookies.get('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          if (response.status === 404) {
            setError('Agendamento não encontrado')
            return
          }
          throw new Error('Erro ao carregar agendamento')
        }

        const data = await response.json()
        console.log('Dados recebidos do servidor:', data)
        
        // Formatar as datas para o formato esperado pelos inputs
        const dataObj = new Date(data.data)
        const horaInicioObj = new Date(data.horaInicio)
        const horaFimObj = new Date(data.horaFim)

        const agendamentoFormatado = {
          ...data,
          data: dataObj.toISOString().split('T')[0],
          horaInicio: horaInicioObj.toTimeString().slice(0, 5),
          horaFim: horaFimObj.toTimeString().slice(0, 5)
        }

        console.log('Dados formatados:', agendamentoFormatado)
        setAgendamento(agendamentoFormatado)
      } catch (error) {
        console.error('Erro ao carregar agendamento:', error)
        setError('Ocorreu um erro ao carregar os dados do agendamento')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgendamento()
  }, [id, router])

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

      console.log('Estado atual do agendamento:', agendamento)

      // Criar data base a partir da string de data
      const [ano, mes, dia] = agendamento.data.split('-')
      const dataBase = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
      
      // Criar data para hora início
      const [horaInicioHora, horaInicioMinuto] = agendamento.horaInicio.split(':')
      const horaInicio = new Date(dataBase)
      horaInicio.setHours(parseInt(horaInicioHora), parseInt(horaInicioMinuto), 0, 0)

      // Criar data para hora fim
      const [horaFimHora, horaFimMinuto] = agendamento.horaFim.split(':')
      const horaFim = new Date(dataBase)
      horaFim.setHours(parseInt(horaFimHora), parseInt(horaFimMinuto), 0, 0)

      const dadosAtualizados = {
        pacienteId: agendamento.pacienteId,
        profissionalId: agendamento.profissionalId,
        data: dataBase.toISOString(),
        horaInicio: horaInicio.toISOString(),
        horaFim: horaFim.toISOString(),
        procedimento: agendamento.procedimento,
        observacoes: agendamento.observacoes || '',
        status: agendamento.status
      }

      console.log('Dados a serem enviados:', dadosAtualizados)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados)
      })

      const responseText = await response.text()
      console.log('Resposta do servidor (texto):', responseText)

      if (!response.ok) {
        let errorMessage = 'Erro ao atualizar agendamento'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorMessage
          console.error('Erro detalhado:', errorData)
        } catch (e) {
          console.error('Erro ao parsear resposta:', e)
        }
        throw new Error(errorMessage)
      }

      try {
        const responseData = JSON.parse(responseText)
        console.log('Resposta do servidor (parsed):', responseData)
      } catch (e) {
        console.error('Erro ao parsear resposta de sucesso:', e)
      }

      router.push('/agendamentos')
    } catch (error: any) {
      console.error('Erro ao atualizar agendamento:', error)
      setError(error.message || 'Ocorreu um erro ao salvar as alterações')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    console.log(`Alterando ${name}:`, value)
    setAgendamento(prev => {
      const newState = { ...prev, [name]: value }
      console.log('Novo estado:', newState)
      return newState
    })
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/agendamentos"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Agendamento</h1>
        </div>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
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
      <div className="flex items-center gap-4">
        <Link
          href="/agendamentos"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Agendamento</h1>
          <p className="text-gray-500">Edite as informações do agendamento</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={agendamento.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="agendado">Agendado</option>
                <option value="confirmado">Confirmado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
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
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}