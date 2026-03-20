'use client';

import Navbar from '@/components/navbar';
import { useSession } from 'next-auth/react';
import { Ticket, Calendar, TrendingUp, Users, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardClientPage() {
  const { data: session, update } = useSession();
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBeOrganizer = async () => {
    setIsUpdating(true);
    try {
      const resp = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'ORGANIZER' }),
      });
      if (!resp.ok) {
        throw new Error('Erro ao atualizar perfil');
      }
      setSuccess(true);
      // Update session locally
      await update({ role: 'ORGANIZER' });
      // Reload to reflect all server-side changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      alert('Houve um erro. Tente novamente ou me avise.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="space-y-4">
           <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
           <p className="text-gray-500 font-medium">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
              Olá, {session.user?.name?.split(' ')[0] || 'Bem-vindo'}! 🏁
            </h1>
            <p className="text-gray-500 font-medium text-lg italic">
              {role === 'ORGANIZER' 
                ? 'Seu comando central está pronto para o Encontro Nacional.' 
                : 'Seja bem-vindo ao seu espaço de participante.'}
            </p>
          </div>
          
          {role === 'BUYER' && (
            <button 
               onClick={handleBeOrganizer}
               disabled={isUpdating || success}
               className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                 success 
                 ? 'bg-green-100 text-green-700' 
                 : 'bg-blue-600 text-white hover:bg-black shadow-xl shadow-blue-100 hover:shadow-gray-200'
               }`}
            >
              {isUpdating ? 'Ativando...' : success ? 'Poderes Ativados! ⚡' : 'Quero ser Organizador'}
              {!isUpdating && !success && <ShieldAlert className="h-5 w-5" />}
              {success && <CheckCircle className="h-5 w-5 animate-in zoom-in" />}
            </button>
          )}
        </header>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <StatsCard 
              title={role === 'ORGANIZER' ? "Vendas Totais" : "Ingressos Ativos"} 
              value={role === 'ORGANIZER' ? "R$ 0,00" : "0"} 
              icon={<TrendingUp className="text-blue-600 h-6 w-6" />} 
            />
            <StatsCard 
              title={role === 'ORGANIZER' ? "Ingressos Vendidos" : "Histórico de Compras"} 
              value="0" 
              icon={<Ticket className="text-blue-600 h-6 w-6" />} 
            />
            <StatsCard 
              title={role === 'ORGANIZER' ? "Eventos Criados" : "Eventos Favoritos"} 
              value="0" 
              icon={<Calendar className="text-blue-600 h-6 w-6" />} 
            />
            <StatsCard 
              title={role === 'ORGANIZER' ? "Usuários Inscritos" : "Check-ins Feitos"} 
              value="0" 
              icon={<Users className="text-blue-600 h-6 w-6" />} 
            />
        </div>

        {/* Lista de Eventos / Ingressos */}
        <section className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-12 text-center overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-all"></div>
          
          <div className="max-w-md mx-auto py-12 relative z-10 space-y-8">
            <div className="bg-gray-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Calendar className="h-12 w-12 text-gray-300" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight italic">
                {role === 'ORGANIZER' 
                  ? 'O palco está vazio!' 
                  : 'Nenhum ingresso encontrado'}
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                {role === 'ORGANIZER' 
                  ? 'Seu próximo grande evento merece um Check-in de respeito. Vamos começar a vender?' 
                  : 'Você ainda não possui ingressos. Que tal explorar os eventos agora?'}
              </p>
            </div>
            {role === 'ORGANIZER' ? (
              <Link href="/organizer/events/new" className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-black transition-all shadow-xl shadow-blue-100 group">
                Criar Primeiro Evento
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
                <Link href="/" className="inline-flex items-center gap-2 px-10 py-5 border-2 border-gray-100 text-gray-900 font-black text-lg rounded-2xl hover:border-blue-500 transition-all">
                  Ver Próximos Eventos
                </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-xl transition-all duration-300">
      <div className="p-4 bg-blue-50 rounded-2xl">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  );
}
