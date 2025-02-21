import { useState, useCallback } from 'react'
import { api } from '@/lib/api'

interface UseOdontogramaProps {
  pacienteId: string
  prontuarioId?: string
}

interface Procedimento {
  id?: string
  dente: number
  face: string
  procedimento: string
  observacao?: string
  data?: string
  pacienteId?: string
  prontuarioId?: string
}

interface OdontogramaData {
  id?: string
  procedimentos: Procedimento[]
  pacienteId?: string
  prontuarioId?: string
}

export function useOdontograma({ pacienteId, prontuarioId }: UseOdontogramaProps) {
  const [data, setData] = useState<OdontogramaData>({ procedimentos: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOdontograma = useCallback(async () => {
    if (!prontuarioId) {
      setData({ procedimentos: [] })
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await api.get(
        `/pacientes/${pacienteId}/prontuario/${prontuarioId}/odontograma`
      )
      
      const odontogramaData = response.data?.dados || response.data
      setData({
        procedimentos: odontogramaData?.procedimentos || []
      })
    } catch (err) {
      console.error('Erro ao carregar odontograma:', err)
      setData({ procedimentos: [] })
      setError('Não foi possível carregar o odontograma. Um novo será criado ao adicionar procedimentos.')
    } finally {
      setLoading(false)
    }
  }, [prontuarioId, pacienteId])

  const saveOdontograma = useCallback(async (dados: Omit<Procedimento, 'id' | 'data' | 'pacienteId' | 'prontuarioId'>) => {
    if (!prontuarioId) {
      setError('É necessário criar um prontuário antes de adicionar procedimentos ao odontograma')
      throw new Error('Prontuário não encontrado')
    }

    try {
      setLoading(true)
      setError(null)
      
      const procedimentoData = {
        ...dados,
        data: new Date().toISOString()
      }
      
      const response = await api.post(
        `/pacientes/${pacienteId}/prontuario/${prontuarioId}/odontograma`,
        procedimentoData
      )
      
      const novoProcedimento = response.data?.dados || response.data
      
      setData(prevData => ({
        ...prevData,
        procedimentos: [...prevData.procedimentos, novoProcedimento]
      }))

      return novoProcedimento
    } catch (err) {
      console.error('Erro ao salvar procedimento:', err)
      setError('Erro ao salvar procedimento no odontograma')
      throw err
    } finally {
      setLoading(false)
    }
  }, [prontuarioId, pacienteId])

  return {
    data,
    loading,
    error,
    fetchOdontograma,
    saveOdontograma,
  }
} 