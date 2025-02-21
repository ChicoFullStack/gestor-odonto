'use client'

import { CalendarDays, Users, CreditCard, Settings, BarChart3, LogOut, UserCog } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">Gestor Odonto</h1>
      </div>

      {/* Informações do usuário */}
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="font-medium text-gray-900">{user?.nome}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block">
          {user?.cargo}
        </span>
      </div>

      <nav className="mt-4">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <BarChart3 className="w-5 h-5 mr-3" />
          Dashboard
        </Link>
        <Link
          href="/agendamentos"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <CalendarDays className="w-5 h-5 mr-3" />
          Agendamentos
        </Link>
        <Link
          href="/pacientes"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <Users className="w-5 h-5 mr-3" />
          Pacientes
        </Link>
        <Link
          href="/profissionais"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <UserCog className="w-5 h-5 mr-3" />
          Profissionais
        </Link>
        <Link
          href="/financeiro"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <CreditCard className="w-5 h-5 mr-3" />
          Financeiro
        </Link>
        <Link
          href="/configuracoes"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <Settings className="w-5 h-5 mr-3" />
          Configurações
        </Link>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </button>
      </div>
    </aside>
  )
} 