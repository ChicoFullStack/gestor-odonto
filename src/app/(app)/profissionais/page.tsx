'use client'

import { Card } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { ESPECIALIDADES_ARRAY } from '@/constants/especialidades'

interface Profissional {
  id: string
  nome: string
  email: string
  telefone: string
  cro: string
  especialidade: string
  status: string
  createdAt: string
}

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        setError(null)
        const queryParams = new URLSearchParams({
          page: pagina.toString(),
          limit: '10'
        })

        if (busca) {
          queryParams.append('busca', busca)
        }

        if (especialidadeSelecionada) {
          queryParams.append('especialidade', especialidadeSelecionada)
        }

        const response = await api.get(`/profissionais?${queryParams}`)
          setProfissionais(response.data.profissionais)
        setTotalPaginas(response.data.pages)
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error)
        setError('Ocorreu um erro ao carregar a lista de profissionais')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfissionais()
  }, [busca, especialidadeSelecionada, pagina])

  const profissionaisFiltrados = profissionais.filter(profissional => {
    const matchBusca = 
      profissional.nome.toLowerCase().includes(busca.toLowerCase()) ||
      profissional.cro.includes(busca) ||
      profissional.email.toLowerCase().includes(busca.toLowerCase())
    
    const matchEspecialidade = !especialidadeSelecionada || 
      profissional.especialidade === especialidadeSelecionada

    return matchBusca && matchEspecialidade
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
        <h1 className="text-3xl font-bold text-gray-900">Profissionais</h1>
        <Link
          href="/profissionais/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Profissional
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar profissionais..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <select
          value={especialidadeSelecionada}
          onChange={(e) => setEspecialidadeSelecionada(e.target.value)}
          className="px-4 py-2 border rounded-lg min-w-[200px]"
        >
          <option value="">Todas as Especialidades</option>
          {ESPECIALIDADES_ARRAY.map((especialidade) => (
            <option key={especialidade} value={especialidade}>
              {especialidade}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CRO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  </div>
                </td>
              </tr>
            ) : profissionaisFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Nenhum profissional encontrado
                </td>
              </tr>
            ) : (
              profissionaisFiltrados.map((profissional) => (
                <tr key={profissional.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{profissional.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{profissional.cro}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{profissional.especialidade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{profissional.telefone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{profissional.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      profissional.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profissional.status.charAt(0).toUpperCase() + profissional.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/profissionais/${profissional.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/profissionais/${profissional.id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Ver detalhes
          </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {!isLoading && totalPaginas > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Página <span className="font-medium">{pagina}</span> de{" "}
                <span className="font-medium">{totalPaginas}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPagina(p => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPagina(num)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      num === pagina
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Próximo
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}