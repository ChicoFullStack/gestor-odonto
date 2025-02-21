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

export default function NovoLancamento() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    tipo: 'receita',
    categoria: '',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    status: 'pendente',
    formaPagamento: '',
    pacienteId: ''
  })
  const [pacientes, setPacientes] = useState<Paciente[]>([])

  // Carregar lista de pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get('/pacientes')
        console.log('Dados recebidos da API:', response.data)
        
        if (response.data?.pacientes) {
          setPacientes(response.data.pacientes)
        }
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error)
        setError('Erro ao carregar lista de pacientes')
      }
    }

    fetchPacientes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'valor') {
      // Formata o valor como moeda
      const numericValue = value.replace(/\D/g, '')
      const formattedValue = (Number(numericValue) / 100).toFixed(2)
      setFormData(prev => ({ ...prev, [name]: formattedValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Formata os dados antes de enviar
      const dadosFormatados = {
        tipo: formData.tipo,
        categoria: formData.categoria,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor), // Converte string para número
        data: new Date(formData.data).toISOString(), // Formata a data
        status: formData.status,
        formaPagamento: formData.formaPagamento,
        pacienteId: formData.pacienteId || null // Garante que seja null se vazio
      }

      const response = await api.post('/financeiro', dadosFormatados)
      
      if (response.status === 201) {
        router.push('/financeiro')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Erro ao criar lançamento:', error)
      setError(
        error.response?.data?.message || 
        'Erro ao criar lançamento. Verifique os dados e tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Novo Lançamento</h1>
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
                      - Tel: {paciente.telefoneCelular.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
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
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
} 