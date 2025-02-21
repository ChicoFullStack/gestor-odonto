'use client'

import { Card } from '@/components/ui/card'
import { Plus, Search, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface Lancamento {
  id: string
  data: string
  tipo: 'receita' | 'despesa'
  categoria: string
  descricao: string
  valor: number
  status: 'pendente' | 'pago' | 'cancelado'
  formaPagamento: string
  paciente?: {
    id: string
    nome: string
    cpf: string
  }
}

export default function Financeiro() {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('')
  const [status, setStatus] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [selectedLancamentoId, setSelectedLancamentoId] = useState<string | null>(null)

  useEffect(() => {
    const fetchLancamentos = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/financeiro')
        setLancamentos(response.data.lancamentos)
      } catch (error) {
        console.error('Erro ao carregar lançamentos:', error)
        setError('Erro ao carregar lançamentos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLancamentos()
  }, [busca, tipo, status, dataInicio, dataFim])

  const handleDeleteClick = (id: string) => {
    setSelectedLancamentoId(id)
    setShowConfirmDelete(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedLancamentoId) return

    try {
      setIsLoading(true)
      await api.delete(`/financeiro/${selectedLancamentoId}`)
      setLancamentos(prev => prev.filter(l => l.id !== selectedLancamentoId))
      setShowConfirmDelete(false)
    } catch (error) {
      console.error('Erro ao excluir lançamento:', error)
      setError('Erro ao excluir lançamento')
    } finally {
      setIsLoading(false)
      setSelectedLancamentoId(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <Link
            href="/financeiro/novo"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Lançamento
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar lançamentos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">Todos os Tipos</option>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Lançamentos */}
      <div className="space-y-4">
        {lancamentos.map(lancamento => (
          <Card key={lancamento.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{lancamento.descricao}</h3>
                <p className="text-sm text-gray-500">
                  {lancamento.paciente?.nome || 'Sem paciente vinculado'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className={`text-lg font-medium ${
                    lancamento.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    R$ {lancamento.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(lancamento.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lancamento.status === 'pago' 
                    ? 'bg-green-100 text-green-800'
                    : lancamento.status === 'pendente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/financeiro/${lancamento.id}/editar`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(lancamento.id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {lancamentos.length === 0 && !isLoading && (
          <Card className="p-6">
            <p className="text-center text-gray-500">Nenhum lançamento encontrado</p>
          </Card>
        )}
      </div>

      {/* Modal de Confirmação */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowConfirmDelete(false)} />
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 