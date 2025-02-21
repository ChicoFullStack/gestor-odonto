import { X } from 'lucide-react'

interface CancelarAgendamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  agendamentoId: string
}

export function CancelarAgendamentoModal({ isOpen, onClose, onConfirm, agendamentoId }: CancelarAgendamentoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Cancelar Agendamento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Tem certeza que deseja cancelar este agendamento?
          </p>
          <p className="text-sm text-gray-500">
            Esta ação não poderá ser desfeita e o horário ficará disponível para outros pacientes.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirmar Cancelamento
          </button>
        </div>
      </div>
    </div>
  )
} 