'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'

interface UseFileUploadProps {
  onUploadComplete?: (url: string) => void
  onError?: (error: Error) => void
  acceptedTypes?: string[]
  pacienteId?: string
}

export function useFileUpload({ 
  onUploadComplete, 
  onError,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  pacienteId
}: UseFileUploadProps = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const validateFile = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não suportado')
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Máximo de 5MB')
    }
  }

  const uploadFile = async (file: File) => {
    try {
      validateFile(file)
      setIsUploading(true)
      setProgress(0)

      const token = Cookies.get('token')
      if (!token) {
        throw new Error('Não autorizado')
      }

      const formData = new FormData()
      formData.append('avatar', file)

      setProgress(30)

      // Se não tiver ID do paciente, cria um upload temporário
      const url = pacienteId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/pacientes/${pacienteId}/avatar`
        : `${process.env.NEXT_PUBLIC_API_URL}/uploads/temp`

      const response = await fetch(url, {
        method: pacienteId ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      setProgress(60)

      if (!response.ok) {
        const text = await response.text()
        let errorMessage = 'Erro ao fazer upload do arquivo'
        
        try {
          const errorData = JSON.parse(text)
          errorMessage = errorData.message || errorMessage
        } catch {
          console.error('Resposta do servidor:', text)
        }
        
        throw new Error(errorMessage)
      }

      let data
      try {
        const text = await response.text()
        data = JSON.parse(text)
        console.log('Resposta do servidor:', data) // Log para debug
      } catch (error) {
        console.error('Erro ao parsear resposta:', error)
        throw new Error('Resposta inválida do servidor')
      }

      // Se for upload de paciente, usa a URL do avatar retornada
      const imageUrl = pacienteId ? data.avatarUrl : data.url
      if (!imageUrl) {
        throw new Error('URL da imagem não retornada pelo servidor')
      }

      setProgress(100)
      onUploadComplete?.(imageUrl)
      return imageUrl
    } catch (error) {
      console.error('Erro detalhado:', error)
      onError?.(error as Error)
      throw error
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return {
    uploadFile,
    isUploading,
    progress
  }
} 