'use client';

import Navbar from '@/components/navbar';
import { useSession } from 'next-auth/react';
import { 
  Ticket, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardClientPage() {
  const { data: session, update } = useSession();
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>({
    stats: {
      totalSales: 'R$ 0,00',
      ticketsSold: 0,
      eventsCreated: 0,
      usersRegistered: 0
    },
    events: []
  });

  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    if (session && role === 'ORGANIZER') {
      fetchDashboardData();
    } else if (session) {
      setIsLoading(false);
    }
  }, [session, role]);

  const fetchDashboardData = async () => {
    try {
      const resp = await fetch('/api/dashboard/organizer');
      if (resp.ok) {
        const result = await resp.json();
        setData(result);
      }
    } catch (e) {
      console.error('Erro ao buscar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBeOrganizer = async () => {
    setIsUpdatingRole(true);
    try {
      const resp = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'ORGANIZER' }),
      });
      if (resp.ok) {
        await update({ role: 'ORGANIZER' });
        window.location.reload();
      }
    } catch (e) {
      alert('Houve um erro ao atualizar perfil.');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  if (!session || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
           <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
           <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] italic">Sincronizando Dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none italic uppercase">
              Olá, {session.user?.name?.split(' ')[0] || 'Bem-vindo'}! 🏁
            </h1>
            <p className="text-gray-400 font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-blue-500" />
              {role === 'ORGANIZER' 
                ? 'Comando Central / Gestão de Eventos' 
                : 'Área do Participante'}
            </p>
          </div>
          
          {role === 'ORGANIZER' && (
            <Link 
              href="/organizer/events/new"
              className="bg-black text-white px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] italic hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 flex items-center gap-3 group"
            >
              Criar Novo Evento
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            </Link>
          )}

          {role === 'USER' && (
            <button onClick={handleBeOrganizer} disabled={isUpdatingRole} className="bg-blue-600 text-white px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
              {isUpdatingRole ? 'Ativando...' : 'Quero ser Organizador'}
            </button>
          )}
        </header>

        {/* Estatísticas Reais */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            <StatsCard title="Volume de Vendas" value={data.stats.totalSales} icon={<TrendingUp className="text-blue-600 h-6 w-6" />} />
            <StatsCard title="Ingressos Vendidos" value={data.stats.ticketsSold} icon={<Ticket className="text-blue-600 h-6 w-6" />} />
            <StatsCard title="Atividades Ativas" value={data.stats.eventsCreated} icon={<CalendarIcon className="text-blue-600 h-6 w-6" />} />
            <StatsCard title="Inscritos" value={data.stats.usersRegistered} icon={<Users className="text-blue-600 h-6 w-6" />} />
        </div>

        {/* LISTA DE EVENTOS DO ORGANIZADOR */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
             <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Meus Eventos 🏙️</h2>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100 italic">{data.events.length} Lançados</span>
          </div>

          {data.events.length === 0 ? (
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-20 text-center">
               <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                  <CalendarIcon className="h-10 w-10 text-gray-200" />
               </div>
               <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight mb-2">O palco continua livre!</h3>
               <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto leading-relaxed">Seu primeiro evento de elite está pronto para ser lançado. Vamos começar agora?</p>
               <Link href="/organizer/events/new" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest italic rounded-[20px] hover:bg-black transition-all shadow-xl shadow-blue-50 group">
                  Criar Primeiro Evento
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {data.events.map((event: any) => (
                 <div key={event.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all group">
                    <div className="h-56 relative overflow-hidden">
                       {event.image ? (
                         <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={event.title} />
                       ) : (
                         <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 italic font-black uppercase tracking-widest text-[10px]">Sem Capa</div>
                       )}
                       <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Público</div>
                    </div>
                    <div className="p-8 space-y-6">
                       <h3 className="text-xl font-black text-slate-900 leading-tight uppercase italic break-words">{event.title}</h3>
                       <div className="space-y-3">
                          <div className="flex items-center gap-3 text-slate-400">
                             <Clock className="h-4 w-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-400">
                             <MapPin className="h-4 w-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest truncate">{event.location}</span>
                          </div>
                       </div>
                       <Link href={`/organizer/events/${event.id}`} className="w-full py-4 bg-gray-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest italic flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                          Gerenciar Evento
                          <ChevronRight className="h-4 w-4" />
                       </Link>
                    </div>
                 </div>
               ))}
            </div>
          )}
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
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}
