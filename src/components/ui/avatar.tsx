'use client'

import Image from 'next/image'
import { User, Camera } from 'lucide-react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { UploadProgress } from './upload-progress'
import { useState } from 'react'

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onImageChange?: (url: string) => void
  onFileSelect?: (file: File) => void
  editable?: boolean
  pacienteId?: string
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-lg',
  lg: 'w-24 h-24 text-2xl',
  xl: 'w-32 h-32 text-3xl'
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export function Avatar({ 
  src: initialSrc, 
  alt, 
  name, 
  size = 'md', 
  onImageChange, 
  onFileSelect, 
  editable = false,
  pacienteId 
}: AvatarProps) {
  const [src, setSrc] = useState(initialSrc)
  const [imageError, setImageError] = useState(false)
  
  const { uploadFile, isUploading, progress } = useFileUpload({
    onUploadComplete: (url) => {
      setSrc(url)
      setImageError(false)
      onImageChange?.(url)
    },
    onError: (error) => {
      setImageError(true)
    },
    pacienteId
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (onFileSelect) {
      onFileSelect(file)
    } else {
      try {
        await uploadFile(file)
      } catch (error) {
        setImageError(true)
      }
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageUrl = (src: string | null | undefined): string | null => {
    try {
      if (!src) return null
      
      // Remove espaços em branco e caracteres inválidos
      const cleanSrc = src.trim()
      
      // Se já for uma URL completa, retorna como está
      if (cleanSrc.startsWith('http')) {
        try {
          new URL(cleanSrc)
          console.log('URL completa do avatar:', cleanSrc)
          return cleanSrc
        } catch (error) {
          // Se a URL completa for inválida, tenta tratar como caminho relativo
          console.log('Tentando tratar URL inválida como caminho relativo:', cleanSrc)
          const relativePath = cleanSrc.split('/uploads/').pop()
          if (relativePath) {
            return getImageUrl(`/uploads/${relativePath}`)
          }
          return null
        }
      }
      
      // Se for um caminho relativo, constrói a URL completa
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
      const path = cleanSrc.startsWith('/') ? cleanSrc : `/${cleanSrc}`
      const fullUrl = `${baseUrl}${path}`
      
      try {
        new URL(fullUrl)
        console.log('URL construída do avatar:', fullUrl)
        return fullUrl
      } catch (error) {
        console.error('URL construída inválida:', fullUrl)
        return null
      }
    } catch (error) {
      console.error('Erro ao processar URL do avatar:', error)
      return null
    }
  }

  const AvatarImage = () => {
    const imageUrl = getImageUrl(src)
    console.log('URL final do avatar:', imageUrl, 'Source original:', src)

    if (imageUrl && !imageError) {
      return (
        <div className={`relative rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <Image
            src={imageUrl}
            alt={alt || 'Avatar do usuário'}
            fill
            className="object-cover"
            onError={(e) => {
              console.error('Erro ao carregar imagem do avatar. URL:', imageUrl)
              handleImageError()
            }}
            sizes={`(max-width: 768px) ${size === 'xl' ? '128px' : '64px'}, ${size === 'xl' ? '128px' : '64px'}`}
            priority
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="w-3/4">
                <UploadProgress progress={progress} />
              </div>
            </div>
          )}
        </div>
      )
    }

    if (name) {
      return (
        <div className={`${sizeClasses[size]} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold`}>
          {getInitials(name)}
        </div>
      )
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-100 text-gray-400 flex items-center justify-center`}>
        <User className="w-1/2 h-1/2" />
      </div>
    )
  }

  if (editable) {
    return (
      <div className="relative group">
        <AvatarImage />
        <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Camera className="w-5 h-5" />
        </label>
      </div>
    )
  }

  return <AvatarImage />
}