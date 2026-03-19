import Navbar from '@/components/navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Ticket, Calendar, TrendingUp, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { StripeConnectButton } from '@/components/stripe-connect-button';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeAccountId: true }
  });

  const isStripeConnected = !!user?.stripeAccountId;


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Olá, {session?.user?.name || 'Bem-vindo'}!</h1>
            <p className="text-gray-600 mt-1">
              {role === 'ORGANIZER' 
                ? 'Aqui está o resumo dos seus eventos e vendas.' 
                : 'Veja seus ingressos e próximos eventos.'}
            </p>
          </div>
          {role === 'ORGANIZER' && (
            <div className="flex items-center gap-3">
              <StripeConnectButton isConnected={isStripeConnected} />
            </div>
          )}
        </header>


        {role === 'ORGANIZER' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <StatsCard title="Vendas Totais" value="R$ 0,00" icon={<TrendingUp className="text-blue-600" />} />
            <StatsCard title="Ingressos Vendidos" value="0" icon={<Ticket className="text-blue-600" />} />
            <StatsCard title="Eventos Ativos" value="0" icon={<Calendar className="text-blue-600" />} />
            <StatsCard title="Total Inscritos" value="0" icon={<Users className="text-blue-600" />} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
             <StatsCard title="Inscrições Ativas" value="0" icon={<Ticket className="text-blue-600" />} />
             <StatsCard title="Eventos Confirmados" value="0" icon={<Calendar className="text-blue-600" />} />
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="max-w-md mx-auto py-8">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nenhum evento encontrado</h3>
            <p className="text-gray-500 mt-2 mb-6">
              {role === 'ORGANIZER' 
                ? 'Você ainda não criou nenhum evento. Comece agora mesmo!' 
                : 'Você ainda não possui ingressos comprados.'}
            </p>
            {role === 'ORGANIZER' && (
              <Link href="/organizer/events/new" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
                Criar meu primeiro evento
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="p-3 bg-blue-50 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
