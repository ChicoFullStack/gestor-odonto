'use client'

import { useState } from 'react'

interface Dente {
  numero: number
  faces: {
    vestibular: string
    lingual: string
    mesial: string
    distal: string
    oclusal: string
  }
}

interface OdontogramaProps {
  onChange?: (dentes: Dente[]) => void
  initialData?: Dente[]
  readOnly?: boolean
}

export function Odontograma({ onChange, initialData, readOnly = false }: OdontogramaProps) {
  const [dentes, setDentes] = useState<Dente[]>(initialData || [])

  const handleFaceClick = (denteNumero: number, face: string) => {
    if (readOnly) return

    setDentes(prevDentes => {
      const denteIndex = prevDentes.findIndex(d => d.numero === denteNumero)
      const newDentes = [...prevDentes]

      if (denteIndex === -1) {
        // Adiciona novo dente
        newDentes.push({
          numero: denteNumero,
          faces: {
            vestibular: face === 'vestibular' ? 'cariado' : '',
            lingual: face === 'lingual' ? 'cariado' : '',
            mesial: face === 'mesial' ? 'cariado' : '',
            distal: face === 'distal' ? 'cariado' : '',
            oclusal: face === 'oclusal' ? 'cariado' : ''
          }
        })
      } else {
        // Atualiza dente existente
        const dente = { ...newDentes[denteIndex] }
        dente.faces = {
          ...dente.faces,
          [face]: dente.faces[face as keyof typeof dente.faces] === 'cariado' ? '' : 'cariado'
        }
        newDentes[denteIndex] = dente
      }

      onChange?.(newDentes)
      return newDentes
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-16 gap-2">
        {/* Dentes superiores */}
        {Array.from({ length: 16 }, (_, i) => i + 18).reverse().map(numero => (
          <div key={numero} className="relative w-12 h-16">
            <div className="text-center text-sm mb-1">{numero}</div>
            <div className="relative w-10 h-10 border border-gray-300">
              {/* Faces do dente */}
              <button
                onClick={() => handleFaceClick(numero, 'vestibular')}
                className="absolute top-0 left-0 right-0 h-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
              <button
                onClick={() => handleFaceClick(numero, 'lingual')}
                className="absolute bottom-0 left-0 right-0 h-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
              <button
                onClick={() => handleFaceClick(numero, 'mesial')}
                className="absolute top-0 bottom-0 left-0 w-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
              <button
                onClick={() => handleFaceClick(numero, 'distal')}
                className="absolute top-0 bottom-0 right-0 w-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
              <button
                onClick={() => handleFaceClick(numero, 'oclusal')}
                className="absolute top-2 bottom-2 left-2 right-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
            </div>
          </div>
        ))}

        {/* Dentes inferiores */}
        {Array.from({ length: 16 }, (_, i) => i + 31).map(numero => (
          <div key={numero} className="relative w-12 h-16">
            <div className="relative w-10 h-10 border border-gray-300">
              {/* Faces do dente */}
              <button
                onClick={() => handleFaceClick(numero, 'vestibular')}
                className="absolute top-0 left-0 right-0 h-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
              <button
                onClick={() => handleFaceClick(numero, 'lingual')}
                className="absolute bottom-0 left-0 right-0 h-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
              <button
                onClick={() => handleFaceClick(numero, 'mesial')}
                className="absolute top-0 bottom-0 left-0 w-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
              <button
                onClick={() => handleFaceClick(numero, 'distal')}
                className="absolute top-0 bottom-0 right-0 w-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
              <button
                onClick={() => handleFaceClick(numero, 'oclusal')}
                className="absolute top-2 bottom-2 left-2 right-2 bg-gray-100 hover:bg-gray-200"
                disabled={readOnly}
              />
            </div>
            <div className="text-center text-sm mt-1">{numero}</div>
          </div>
        ))}
      </div>
    </div>
  )
} 