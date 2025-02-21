'use client'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, Edit, AlertCircle, FileText, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { api } from '@/lib/api'

interface Paciente {
  id: string
  nome: string
  cpf: string
  dataNascimento: string
  genero: string
  email: string
  telefoneCelular: string
  telefoneFixo: string
  avatarUrl: string | null
  status: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  contatoEmergenciaNome: string
  contatoEmergenciaTelefone: string
  contatoEmergenciaParentesco: string
  agendamentos: Array<{
    id: string
    data: string
    horaInicio: string
    horaFim: string
    procedimento: string
    status: string
    profissional: {
      nome: string
    }
  }>
  historicoMedico?: {
    alergias: string
    doencasCronicas: string
    cirurgiasPrevias: string
    medicamentosAtuais: string
  }
}

export default function DetalhesPaciente() {
  const { id } = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setError(null)
        const token = Cookies.get('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes/${id}`, {
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
            setError('Paciente não encontrado')
            return
          }
          throw new Error('Erro ao carregar paciente')
        }

        const data = await response.json()
        console.log('Dados do paciente recebidos:', data)
        console.log('URL do avatar recebida:', data.avatarUrl)
        setPaciente(data)
      } catch (error) {
        console.error('Erro ao carregar paciente:', error)
        setError('Ocorreu um erro ao carregar os dados do paciente')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaciente()
  }, [id, router])

  const handleExcluirPaciente = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      setIsDeleting(true)
      const token = Cookies.get('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Usando fetch diretamente com a rota correta
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Verifica a resposta
      if (response.ok) {
        router.push('/pacientes')
        return
      }

      // Tratamento de erro
      let mensagemErro = 'Não foi possível excluir o paciente.'
      
      try {
        const data = await response.json()
        mensagemErro = data.message || mensagemErro
      } catch {
        // Se não conseguir ler o JSON, usa mensagem padrão baseada no status
        switch (response.status) {
          case 409:
            mensagemErro = 'Não é possível excluir o paciente pois existem registros vinculados.'
            break
          case 404:
            mensagemErro = 'Paciente não encontrado.'
            break
          case 403:
            mensagemErro = 'Você não tem permissão para excluir este paciente.'
            break
        }
      }
      
      setError(mensagemErro)
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)
      setError('Ocorreu um erro ao tentar excluir o paciente. Por favor, tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/pacientes"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Paciente</h1>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
            {error.includes('registros vinculados') && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                <p className="font-medium mb-2">Para excluir este paciente, você precisa primeiro:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Excluir todos os agendamentos do paciente</li>
                  <li>Excluir todos os prontuários do paciente</li>
                </ul>
              </div>
            )}
            <div className="mt-2">
              <Link
                href="/pacientes"
                className="text-blue-600 hover:text-blue-800"
              >
                Voltar para lista de pacientes
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (isLoading || !paciente) {
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

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/pacientes"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Paciente</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/pacientes/${id}/prontuario`}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FileText className="w-4 h-4" />
            Prontuário
          </Link>
          <Link
            href={`/pacientes/${id}/editar`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            Editar Paciente
          </Link>
          <button
            onClick={handleExcluirPaciente}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Excluindo...' : 'Excluir Paciente'}
          </button>
        </div>
      </div>

      {/* Informações Básicas */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <Avatar
              src={paciente.avatarUrl}
              alt={paciente.nome}
              name={paciente.nome}
              size="xl"
              editable={true}
              pacienteId={paciente.id}
              onImageChange={(url) => {
                console.log('Nova URL do avatar:', url)
                setPaciente(prev => prev ? { ...prev, avatarUrl: url } : null)
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{paciente.nome}</h2>
                <p className="text-gray-500">CPF: {paciente.cpf}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                paciente.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {paciente.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{paciente.telefoneCelular}</span>
              </div>
              {paciente.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{paciente.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Nascimento: {formatarData(paciente.dataNascimento)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Endereço */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-gray-600">
              {paciente.logradouro}, {paciente.numero}
              {paciente.complemento && ` - ${paciente.complemento}`}
            </p>
            <p className="text-gray-600">
              {paciente.bairro} - {paciente.cidade}/{paciente.estado}
            </p>
            <p className="text-gray-600">CEP: {paciente.cep}</p>
          </div>
        </div>
      </Card>

      {/* Contato de Emergência */}
      {paciente.contatoEmergenciaNome && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato de Emergência</h3>
          <div className="space-y-2">
            <p className="text-gray-600">Nome: {paciente.contatoEmergenciaNome}</p>
            <p className="text-gray-600">Telefone: {paciente.contatoEmergenciaTelefone}</p>
            <p className="text-gray-600">Parentesco: {paciente.contatoEmergenciaParentesco}</p>
          </div>
        </Card>
      )}

      {/* Histórico Médico */}
      {paciente.historicoMedico && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Médico</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paciente.historicoMedico.alergias && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Alergias</h4>
                <p className="text-gray-600">{paciente.historicoMedico.alergias}</p>
              </div>
            )}
            {paciente.historicoMedico.doencasCronicas && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Doenças Crônicas</h4>
                <p className="text-gray-600">{paciente.historicoMedico.doencasCronicas}</p>
              </div>
            )}
            {paciente.historicoMedico.cirurgiasPrevias && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Cirurgias Prévias</h4>
                <p className="text-gray-600">{paciente.historicoMedico.cirurgiasPrevias}</p>
              </div>
            )}
            {paciente.historicoMedico.medicamentosAtuais && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Medicamentos Atuais</h4>
                <p className="text-gray-600">{paciente.historicoMedico.medicamentosAtuais}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Últimos Agendamentos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos Agendamentos</h3>
        <div className="space-y-4">
          {paciente.agendamentos.length > 0 ? (
            paciente.agendamentos.map(agendamento => (
              <div
                key={agendamento.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {formatarData(agendamento.data)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatarHora(agendamento.horaInicio)} - {formatarHora(agendamento.horaFim)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900">{agendamento.procedimento}</span>
                    <span className="text-sm text-gray-500">
                      Dr(a). {agendamento.profissional.nome}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  agendamento.status === 'concluido' ? 'bg-green-100 text-green-800' :
                  agendamento.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum agendamento encontrado</p>
          )}
        </div>
      </Card>
    </div>
  )
}