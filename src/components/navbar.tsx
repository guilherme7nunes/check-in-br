'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User, Calendar, PlusCircle, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Check in Br</span>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              {session?.user && (session.user as any).role === 'ORGANIZER' && (
                <Link href="/organizer/events/new" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Criar Evento
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <User className="h-4 w-4 text-gray-400" />
                  {session.user?.name || session.user?.email}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors">
                  Entrar
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                  Começar agora
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <Link href="/dashboard" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
            Dashboard
          </Link>
          {session?.user && (session.user as any).role === 'ORGANIZER' && (
            <Link href="/organizer/events/new" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
              Criar Evento
            </Link>
          )}
          <hr className="my-2 border-gray-50" />
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full text-left text-red-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Sair da conta
            </button>
          ) : (
            <>
              <Link href="/login" className="block text-gray-600 px-3 py-2 rounded-md text-base font-medium">
                Entrar
              </Link>
              <Link href="/register" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium">
                Criar conta
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
