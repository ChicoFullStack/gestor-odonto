'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  User, 
  Edit, 
  Trash2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface Profissional {
  id: string
  nome: string
  email: string
  telefone: string
  especialidade: string
  cro: string
  cpf: string
  rg: string | null
  dataNascimento: string
  avatarUrl: string | null
  status: 'ativo' | 'inativo'
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
}

export default function DetalhesProfissional({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [profissional, setProfissional] = useState<Profissional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchProfissional = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/profissionais/${params.id}`)
        setProfissional(response.data)
      } catch (error) {
        console.error('Erro ao carregar profissional:', error)
        setError('Não foi possível carregar os dados do profissional')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfissional()
  }, [params.id])

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await api.delete(`/profissionais/${params.id}`)
      router.push('/profissionais')
    } catch (error) {
      console.error('Erro ao excluir profissional:', error)
      setError('Não foi possível excluir o profissional')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error || !profissional) {
    return (
      <div className="p-6">
        <Card className="p-4">
          <p className="text-red-600">{error || 'Profissional não encontrado'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/profissionais"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Profissional</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/profissionais/${params.id}/editar`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900">Confirmar exclusão</h3>
              <p className="text-red-700 mb-4">
                Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar
            src={profissional.avatarUrl}
            alt={profissional.nome}
            name={profissional.nome}
            className="w-24 h-24 text-2xl"
          />
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profissional.nome}</h2>
                <p className="text-gray-500">{profissional.especialidade}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profissional.status === 'ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {profissional.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <User className="w-5 h-5 inline-block mr-2" />
                    Informações Pessoais
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      CPF: <span className="text-gray-900">{formatarCPF(profissional.cpf)}</span>
                    </p>
                    {profissional.rg && (
                      <p className="text-gray-600">
                        RG: <span className="text-gray-900">{profissional.rg}</span>
                      </p>
                    )}
                    <p className="text-gray-600">
                      Data de Nascimento: <span className="text-gray-900">
                        {formatarData(profissional.dataNascimento)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <FileText className="w-5 h-5 inline-block mr-2" />
                    Informações Profissionais
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      CRO: <span className="text-gray-900">{profissional.cro}</span>
                    </p>
                    <p className="text-gray-600">
                      Especialidade: <span className="text-gray-900">{profissional.especialidade}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    <Phone className="w-5 h-5 inline-block mr-2" />
                    Contato
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {profissional.email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {formatarTelefone(profissional.telefone)}
                    </p>
                  </div>
                </div>

                {(profissional.logradouro || profissional.cidade) && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      <MapPin className="w-5 h-5 inline-block mr-2" />
                      Endereço
                    </h3>
                    <div className="space-y-1 text-gray-600">
                      {profissional.logradouro && (
                        <p>{profissional.logradouro}, {profissional.numero}</p>
                      )}
                      {profissional.complemento && (
                        <p>{profissional.complemento}</p>
                      )}
                      {profissional.bairro && (
                        <p>{profissional.bairro}</p>
                      )}
                      {profissional.cidade && (
                        <p>{profissional.cidade} - {profissional.estado}</p>
                      )}
                      {profissional.cep && (
                        <p>CEP: {profissional.cep}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 