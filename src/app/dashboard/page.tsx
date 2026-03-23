'use client';

import Navbar from '@/components/navbar';
import { useSession } from 'next-auth/react';
import { 
  Ticket, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Loader2,
  MapPin,
  Clock,
  Plus,
  ChevronRight,
  LayoutDashboard
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
      console.error('Erro dashboard fetch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBeOrganizer = async () => {
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
    } catch (e) {}
  };

  if (!session || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
           <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
           <p className="text-slate-400 font-medium text-xs tracking-widest">Sincronizando ambiente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFE] font-sans pb-20">
      <Navbar />
      <main className="max-w-6xl mx-auto py-16 px-6 lg:px-8">
        
        {/* Header Elegante */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
              Olá, {session.user?.name?.split(' ')[0] || 'Bem-vindo'}
            </h1>
            <p className="text-slate-500 font-medium">
              {role === 'ORGANIZER' 
                ? 'Seja bem-vindo ao seu centro de gestão.' 
                : 'Seja bem-vindo ao seu espaço de participante.'}
            </p>
          </div>
          
          {role === 'ORGANIZER' && (
            <Link 
              href="/organizer/events/new"
              className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-sm hover:bg-black transition-all shadow-sm flex items-center gap-2 group"
            >
              Criar Novo Evento
              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Link>
          )}

          {role === 'USER' && (
            <button onClick={handleBeOrganizer} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all">
              Tornar-se Organizador
            </button>
          )}
        </header>

        {/* Estatísticas Minimalistas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
            <StatsCard title="Vendas Totais" value={data.stats.totalSales} icon={<TrendingUp className="text-blue-500 h-5 w-5" />} />
            <StatsCard title="Ingressos Vendidos" value={data.stats.ticketsSold} icon={<Ticket className="text-slate-400 h-5 w-5" />} />
            <StatsCard title="Eventos Ativos" value={data.stats.eventsCreated} icon={<CalendarIcon className="text-slate-400 h-5 w-5" />} />
            <StatsCard title="Usuários Inscritos" value={data.stats.usersRegistered} icon={<Users className="text-slate-400 h-5 w-5" />} />
        </div>

        {/* Listagem de Eventos Clean */}
        <section className="space-y-12">
          <div className="flex items-center gap-2">
             <LayoutDashboard className="h-5 w-5 text-slate-300" />
             <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Meus Eventos</h2>
             <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-3 py-1 rounded-full ml-2">{data.events.length} LANÇADOS</span>
          </div>

          {data.events.length === 0 ? (
            <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-24 text-center">
               <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                  <CalendarIcon className="h-8 w-8 text-slate-200" />
               </div>
               <h3 className="text-xl font-semibold text-slate-800 mb-2">Inicie seu projeto</h3>
               <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">Lance seu primeiro evento de elite e comece a gerenciar inscritos em minutos.</p>
               <Link href="/organizer/events/new" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-all border border-slate-200">
                  Criar Primeiro Evento
                  <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {data.events.map((event: any) => (
                 <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-all group flex flex-col">
                    <div className="h-52 relative overflow-hidden bg-slate-50">
                       {event.image ? (
                         <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={event.title} />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-200 font-bold uppercase tracking-widest text-[10px]">Sem Imagem</div>
                       )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                       <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-slate-900 leading-snug">{event.title}</h3>
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                <Clock className="h-3.5 w-3.5" />
                                {new Date(event.date).toLocaleDateString('pt-BR')}
                             </div>
                             <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="truncate">{event.location}</span>
                             </div>
                          </div>
                       </div>
                       <Link href={`/organizer/events/${event.id}`} className="mt-8 py-3 w-full bg-slate-50 text-slate-800 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white border border-slate-100">
                          Gerenciar
                          <ChevronRight className="h-3.5 w-3.5" />
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
    <div className="bg-white p-7 rounded-2xl border border-slate-100 flex items-center gap-5 hover:border-slate-200 transition-all group">
      <div className="p-3.5 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
