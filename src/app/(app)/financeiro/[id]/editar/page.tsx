'use client'

import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface FormData {
  tipo: 'receita' | 'despesa'
  categoria: string
  descricao: string
  valor: string
  data: string
  status: 'pendente' | 'pago' | 'cancelado'
  formaPagamento: string
  pacienteId?: string
}

interface Paciente {
  id: string
  nome: string
  cpf: string
  telefoneCelular: string
}

export default function EditarLancamento({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [formData, setFormData] = useState<FormData>({
    tipo: 'receita',
    categoria: '',
    descricao: '',
    valor: '',
    data: '',
    status: 'pendente',
    formaPagamento: '',
    pacienteId: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lancamentoRes, pacientesRes] = await Promise.all([
          api.get(`/financeiro/${params.id}`),
          api.get('/pacientes')
        ])

        if (lancamentoRes.data) {
          setFormData({
            ...lancamentoRes.data,
            data: new Date(lancamentoRes.data.data).toISOString().split('T')[0],
            valor: lancamentoRes.data.valor.toString(),
            pacienteId: lancamentoRes.data.pacienteId || ''
          })
        }

        if (pacientesRes.data?.pacientes) {
          setPacientes(pacientesRes.data.pacientes)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setError('Erro ao carregar dados do lançamento')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'valor') {
      const numericValue = value.replace(/\D/g, '')
      const formattedValue = (Number(numericValue) / 100).toFixed(2)
      setFormData(prev => ({ ...prev, [name]: formattedValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const dadosFormatados = {
        tipo: formData.tipo,
        categoria: formData.categoria,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        data: new Date(formData.data).toISOString(),
        status: formData.status,
        formaPagamento: formData.formaPagamento,
        pacienteId: formData.pacienteId || null
      }

      await api.put(`/financeiro/${params.id}`, dadosFormatados)
      router.push('/financeiro')
      router.refresh()
    } catch (error: any) {
      console.error('Erro ao atualizar lançamento:', error)
      setError(
        error.response?.data?.message || 
        'Erro ao atualizar lançamento. Verifique os dados e tente novamente.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/financeiro"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Lançamento</h1>
      </div>

      <Card className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Selecione uma categoria</option>
                {formData.tipo === 'receita' ? (
                  <>
                    <option value="consulta">Consulta</option>
                    <option value="procedimento">Procedimento</option>
                    <option value="exame">Exame</option>
                    <option value="outros">Outros</option>
                  </>
                ) : (
                  <>
                    <option value="material">Material</option>
                    <option value="equipamento">Equipamento</option>
                    <option value="salario">Salário</option>
                    <option value="aluguel">Aluguel</option>
                    <option value="servicos">Serviços</option>
                    <option value="outros">Outros</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <input
                type="text"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                placeholder="0,00"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma de Pagamento
              </label>
              <select
                name="formaPagamento"
                value={formData.formaPagamento}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="transferencia">Transferência</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            {formData.tipo === 'receita' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente
                </label>
                <select
                  name="pacienteId"
                  value={formData.pacienteId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nome} - CPF: {paciente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/financeiro"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
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
    </div>
  )
} 