'use client'

import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { api } from '@/lib/api'

interface ConfigForm {
  clinica: {
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: {
      cep: string
      logradouro: string
      numero: string
      complemento: string
      bairro: string
      cidade: string
      estado: string
    }
  }
  notificacoes: {
    emailAgendamento: boolean
    emailLembrete: boolean
    whatsappLembrete: boolean
  }
  financeiro: {
    diasVencimento: number
    lembreteAntecedencia: number
  }
}

export default function ConfiguracoesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<ConfigForm>({
    clinica: {
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      }
    },
    notificacoes: {
      emailAgendamento: true,
      emailLembrete: true,
      whatsappLembrete: false
    },
    financeiro: {
      diasVencimento: 30,
      lembreteAntecedencia: 3
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name.includes('.')) {
      const parts = name.split('.')
      if (parts.length === 3) {
        // Para campos do endereço (ex: clinica.endereco.cep)
        const [section, subsection, field] = parts
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof ConfigForm],
            [subsection]: {
              ...prev[section as keyof ConfigForm][subsection as keyof typeof prev[typeof section]],
              [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
            }
          }
        }))
      } else {
        // Para campos simples com um nível (ex: financeiro.diasVencimento)
        const [section, field] = parts
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof ConfigForm],
            [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
          }
        }))
      }
    } else {
      // Para campos de primeiro nível
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Garante que os valores numéricos sejam enviados como números
      const dataToSend = {
        ...formData,
        financeiro: {
          ...formData.financeiro,
          diasVencimento: Number(formData.financeiro.diasVencimento),
          lembreteAntecedencia: Number(formData.financeiro.lembreteAntecedencia)
        }
      }

      await api.put('/configuracoes', dataToSend)
      setSuccess(true)
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error)
      setError(error.response?.data?.message || 'Erro ao salvar as configurações. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados da Clínica */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Dados da Clínica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Clínica
              </label>
              <input
                type="text"
                name="clinica.nome"
                value={formData.clinica.nome}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                name="clinica.cnpj"
                value={formData.clinica.cnpj}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                name="clinica.telefone"
                value={formData.clinica.telefone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="clinica.email"
                value={formData.clinica.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <h3 className="text-lg font-medium mt-6 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP
              </label>
              <input
                type="text"
                name="clinica.endereco.cep"
                value={formData.clinica.endereco.cep}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logradouro
              </label>
              <input
                type="text"
                name="clinica.endereco.logradouro"
                value={formData.clinica.endereco.logradouro}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                name="clinica.endereco.numero"
                value={formData.clinica.endereco.numero}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                type="text"
                name="clinica.endereco.complemento"
                value={formData.clinica.endereco.complemento}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                name="clinica.endereco.bairro"
                value={formData.clinica.endereco.bairro}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                name="clinica.endereco.cidade"
                value={formData.clinica.endereco.cidade}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="clinica.endereco.estado"
                value={formData.clinica.endereco.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Selecione</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notificações */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notificações</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notificacoes.emailAgendamento"
                checked={formData.notificacoes.emailAgendamento}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-gray-700">
                Enviar e-mail de confirmação de agendamento
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="notificacoes.emailLembrete"
                checked={formData.notificacoes.emailLembrete}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-gray-700">
                Enviar lembrete por e-mail
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="notificacoes.whatsappLembrete"
                checked={formData.notificacoes.whatsappLembrete}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-gray-700">
                Enviar lembrete por WhatsApp
              </label>
            </div>
          </div>
        </Card>

        {/* Financeiro */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financeiro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dias para Vencimento
              </label>
              <input
                type="number"
                name="financeiro.diasVencimento"
                value={formData.financeiro.diasVencimento}
                onChange={handleChange}
                min="1"
                max="90"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dias de Antecedência para Lembrete
              </label>
              <input
                type="number"
                name="financeiro.lembreteAntecedencia"
                value={formData.financeiro.lembreteAntecedencia}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </Card>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">Configurações salvas com sucesso!</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  )
} 