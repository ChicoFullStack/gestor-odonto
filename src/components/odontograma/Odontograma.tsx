'use client'

import { useState } from 'react'
import { Tooth } from './Tooth'

interface OdontogramaProps {
  data?: any
  onChange?: (data: any) => void
  readOnly?: boolean
}

export function Odontograma({ data, onChange, readOnly = false }: OdontogramaProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)

  // Definição dos dentes superiores e inferiores
  const upperTeeth = Array.from({ length: 16 }, (_, i) => 18 - i)
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 31 - i)

  const handleToothClick = (number: number) => {
    if (readOnly) return
    setSelectedTooth(selectedTooth === number ? null : number)
  }

  const handleToothUpdate = (number: number, toothData: any) => {
    if (readOnly || !onChange) return
    
    onChange({
      ...data,
      [number]: toothData
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Dentes Superiores */}
      <div className="grid grid-cols-16 gap-1 mb-8">
        {upperTeeth.map((number) => (
          <Tooth
            key={number}
            number={number}
            data={data?.[number]}
            selected={selectedTooth === number}
            onClick={() => handleToothClick(number)}
            onUpdate={(toothData) => handleToothUpdate(number, toothData)}
            readOnly={readOnly}
          />
        ))}
      </div>

      {/* Dentes Inferiores */}
      <div className="grid grid-cols-16 gap-1">
        {lowerTeeth.map((number) => (
          <Tooth
            key={number}
            number={number}
            data={data?.[number]}
            selected={selectedTooth === number}
            onClick={() => handleToothClick(number)}
            onUpdate={(toothData) => handleToothUpdate(number, toothData)}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  )
} 