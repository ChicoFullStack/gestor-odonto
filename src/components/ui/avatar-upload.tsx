'use client'

import { useState, useRef } from 'react'
import { Avatar } from './avatar'
import { Camera, X } from 'lucide-react'

interface AvatarUploadProps {
  currentAvatar?: string | null
  name: string
  onUpload: (file: File) => Promise<void>
  onRemove?: () => Promise<void>
}

export function AvatarUpload({ currentAvatar, name, onUpload, onRemove }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem')
      return
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    try {
      setIsUploading(true)
      setError(null)
      await onUpload(file)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      setError('Erro ao fazer upload da imagem')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative inline-block group">
      <div onClick={handleClick} className="cursor-pointer">
        <Avatar
          src={currentAvatar}
          alt={name}
          name={name}
          className="w-24 h-24 text-2xl hover:opacity-75"
        />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-50 rounded-full p-2">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentAvatar && onRemove && (
        <button
          type="button"
          onClick={async () => {
            try {
              await onRemove()
            } catch (error) {
              console.error('Erro ao remover avatar:', error)
              setError('Erro ao remover imagem')
            }
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {error && (
        <div className="absolute top-full mt-2 w-48 bg-red-50 text-red-600 text-sm p-2 rounded-lg">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  )
} 