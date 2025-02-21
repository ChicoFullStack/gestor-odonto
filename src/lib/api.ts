import axios from 'axios'
import Cookies from 'js-cookie'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backodonto.boloko.cloud'
})

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}) 