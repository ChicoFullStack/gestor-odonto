import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { useOdontograma } from '@/hooks/useOdontograma'
import { ProcedimentoModal } from './ProcedimentoModal'
import { AlertCircle, Info } from 'lucide-react'

interface Dente {
  numero: number
  face: string
  procedimento: string
  observacao?: string
}

interface OdontogramaProps {
  pacienteId: string
  prontuarioId?: string
}

export function Odontograma({ pacienteId, prontuarioId }: OdontogramaProps) {
  const { data, loading, error, fetchOdontograma, saveOdontograma } = useOdontograma({ 
    pacienteId, 
    prontuarioId 
  })
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [selectedFace, setSelectedFace] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    if (pacienteId) {
      fetchOdontograma()
    }
  }, [pacienteId, prontuarioId, fetchOdontograma])

  const dentes = Array.from({ length: 32 }, (_, i) => i + 1)

  const handleToothClick = (numero: number) => {
    if (!prontuarioId) {
      return // Não permite selecionar dente sem prontuário
    }
    setSelectedTooth(numero)
  }

  const handleFaceClick = (face: string, numero: number) => {
    if (!prontuarioId) {
      return // Não permite selecionar face sem prontuário
    }
    setSelectedTooth(numero)
    setSelectedFace(face)
    setIsModalOpen(true)
  }

  const handleSaveProcedimento = async (dados: { procedimento: string; observacao: string }) => {
    if (selectedTooth && selectedFace) {
      try {
        await saveOdontograma({
          dente: selectedTooth,
          face: selectedFace,
          ...dados
        })
        setIsModalOpen(false)
        setSelectedTooth(null)
        setSelectedFace(null)
      } catch (error) {
        console.error('Erro ao salvar procedimento:', error)
      }
    }
  }

  const getFaceColor = (numero: number, face: string) => {
    const procedimento = data.procedimentos.find(
      (p) => p.dente === numero && p.face === face
    )
    return procedimento ? 'bg-blue-500' : 'bg-gray-100'
  }

  const getFaceTitle = (numero: number, face: string) => {
    const procedimento = data.procedimentos.find(
      (p) => p.dente === numero && p.face === face
    )
    return procedimento ? `${procedimento.procedimento}${procedimento.observacao ? ` - ${procedimento.observacao}` : ''}` : ''
  }

  if (!prontuarioId) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-amber-600">
          <Info className="w-5 h-5" />
          <p>Crie um registro no prontuário antes de adicionar procedimentos ao odontograma.</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6 relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Odontograma</h3>
        
        <div className="grid grid-cols-16 gap-2">
          {dentes.map((numero) => (
            <div
              key={numero}
              className={`relative border rounded-lg p-2 cursor-pointer hover:bg-gray-50 ${
                selectedTooth === numero ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => handleToothClick(numero)}
            >
              <div className="text-center font-medium">{numero}</div>
              <div className="grid grid-cols-3 grid-rows-3 gap-0.5 mt-1">
                {/* Face Vestibular */}
                <div
                  className={`col-start-2 h-3 hover:bg-blue-200 ${getFaceColor(numero, 'V')}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFaceClick('V', numero)
                  }}
                  title={getFaceTitle(numero, 'V')}
                />
                {/* Face Mesial */}
                <div
                  className={`row-start-2 w-3 hover:bg-blue-200 ${getFaceColor(numero, 'M')}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFaceClick('M', numero)
                  }}
                  title={getFaceTitle(numero, 'M')}
                />
                {/* Face Oclusal */}
                <div
                  className={`row-start-2 col-start-2 hover:bg-blue-200 ${getFaceColor(numero, 'O')}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFaceClick('O', numero)
                  }}
                  title={getFaceTitle(numero, 'O')}
                />
                {/* Face Distal */}
                <div
                  className={`row-start-2 col-start-3 w-3 hover:bg-blue-200 ${getFaceColor(numero, 'D')}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFaceClick('D', numero)
                  }}
                  title={getFaceTitle(numero, 'D')}
                />
                {/* Face Lingual/Palatina */}
                <div
                  className={`row-start-3 col-start-2 h-3 hover:bg-blue-200 ${getFaceColor(numero, 'L')}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFaceClick('L', numero)
                  }}
                  title={getFaceTitle(numero, 'L')}
                />
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </Card>

      {selectedTooth && selectedFace && (
        <ProcedimentoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTooth(null)
            setSelectedFace(null)
          }}
          onSave={handleSaveProcedimento}
          dente={selectedTooth}
          face={selectedFace}
        />
      )}
    </>
  )
} 