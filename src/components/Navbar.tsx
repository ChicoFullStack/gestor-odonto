'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/agenda"
                className={`${isActive('/agenda')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Agenda do Dia
              </Link>
              <Link
                href="/"
                className={`${isActive('/')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                href="/pacientes"
                className={`${isActive('/pacientes')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Pacientes
              </Link>
              <Link
                href="/agendamentos"
                className={`${isActive('/agendamentos')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Agendamentos
              </Link>
              <Link
                href="/financeiro"
                className={`${isActive('/financeiro')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Financeiro
              </Link>
              <Link
                href="/profissionais"
                className={`${isActive('/profissionais')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Profissionais
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/configuracoes"
              className={`${isActive('/configuracoes')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Configurações
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 