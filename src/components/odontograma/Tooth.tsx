'use client'

import { useState } from 'react'

interface ToothProps {
  number: number
  data?: any
  selected?: boolean
  onClick?: () => void
  onUpdate?: (data: any) => void
  readOnly?: boolean
}

export function Tooth({ number, data, selected, onClick, onUpdate, readOnly = false }: ToothProps) {
  const [procedure, setProcedure] = useState(data?.procedure || '')
  const [condition, setCondition] = useState(data?.condition || '')

  const handleProcedureChange = (newProcedure: string) => {
    if (readOnly) return
    setProcedure(newProcedure)
    onUpdate?.({ ...data, procedure: newProcedure })
  }

  const handleConditionChange = (newCondition: string) => {
    if (readOnly) return
    setCondition(newCondition)
    onUpdate?.({ ...data, condition: newCondition })
  }

  return (
    <div 
      className={`
        relative aspect-square border rounded-md p-1 cursor-pointer
        ${selected ? 'border-blue-500' : 'border-gray-300'}
        ${readOnly ? 'cursor-default' : 'hover:border-blue-300'}
      `}
      onClick={onClick}
    >
      {/* Número do dente */}
      <div className="text-xs text-center font-medium">{number}</div>

      {/* Representação visual do dente */}
      <div className="w-full aspect-square bg-white border border-gray-200 rounded">
        {/* Faces do dente */}
        <div className="relative w-full h-full">
          {/* Face Superior */}
          <div 
            className={`absolute top-0 left-1/4 w-1/2 h-1/4 border-b border-gray-300
              ${condition === 'carie' ? 'bg-red-200' : ''}
              ${condition === 'restaurado' ? 'bg-blue-200' : ''}
              ${condition === 'ausente' ? 'bg-gray-200' : ''}
            `}
          />
          
          {/* Face Inferior */}
          <div 
            className={`absolute bottom-0 left-1/4 w-1/2 h-1/4 border-t border-gray-300
              ${condition === 'carie' ? 'bg-red-200' : ''}
              ${condition === 'restaurado' ? 'bg-blue-200' : ''}
              ${condition === 'ausente' ? 'bg-gray-200' : ''}
            `}
          />
          
          {/* Face Esquerda */}
          <div 
            className={`absolute top-1/4 left-0 w-1/4 h-1/2 border-r border-gray-300
              ${condition === 'carie' ? 'bg-red-200' : ''}
              ${condition === 'restaurado' ? 'bg-blue-200' : ''}
              ${condition === 'ausente' ? 'bg-gray-200' : ''}
            `}
          />
          
          {/* Face Direita */}
          <div 
            className={`absolute top-1/4 right-0 w-1/4 h-1/2 border-l border-gray-300
              ${condition === 'carie' ? 'bg-red-200' : ''}
              ${condition === 'restaurado' ? 'bg-blue-200' : ''}
              ${condition === 'ausente' ? 'bg-gray-200' : ''}
            `}
          />
          
          {/* Centro */}
          <div 
            className={`absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-gray-300
              ${condition === 'carie' ? 'bg-red-200' : ''}
              ${condition === 'restaurado' ? 'bg-blue-200' : ''}
              ${condition === 'ausente' ? 'bg-gray-200' : ''}
            `}
          />
        </div>
      </div>

      {/* Menu de opções (visível apenas quando selecionado e não readonly) */}
      {selected && !readOnly && (
        <div className="absolute top-full left-0 z-50 w-48 bg-white shadow-lg rounded-md mt-1 p-2">
          <div className="space-y-2">
            <select
              value={condition}
              onChange={(e) => handleConditionChange(e.target.value)}
              className="w-full text-sm rounded border border-gray-300"
            >
              <option value="">Condição</option>
              <option value="normal">Normal</option>
              <option value="carie">Cárie</option>
              <option value="restaurado">Restaurado</option>
              <option value="ausente">Ausente</option>
            </select>

            <select
              value={procedure}
              onChange={(e) => handleProcedureChange(e.target.value)}
              className="w-full text-sm rounded border border-gray-300"
            >
              <option value="">Procedimento</option>
              <option value="limpeza">Limpeza</option>
              <option value="restauracao">Restauração</option>
              <option value="extracao">Extração</option>
              <option value="canal">Tratamento de Canal</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
} 