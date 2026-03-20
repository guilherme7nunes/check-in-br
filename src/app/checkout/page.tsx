'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const dynamic = 'force-dynamic';
import Navbar from '@/components/navbar';
import { 
  User, 
  Mail, 
  CreditCard, 
  ChevronRight, 
  Utensils, 
  Bus, 
  Check,
  PlusCircle,
  AlertCircle,
  Ticket as TicketIcon,
  Search
} from 'lucide-react';

interface Attendee {
  id: number;
  name: string;
  email: string;
  phone: string;
  addons: string[];
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-gray-500">Preparando sua inscrição... 🏁</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  
  // Lógica Dinâmica de Ingressos (Simulada para o Encontro Nacional)
  const ticketId = searchParams.get('ticket') || '1';
  const qty = parseInt(searchParams.get('qty') || '1');
  
  const isDouble = ticketId === 'DUPLA'; // Exemplo: Ingresso Promocional
  const peoplePerTicket = isDouble ? 2 : 1;
  const totalPeople = qty * peoplePerTicket;

  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    // Inicializa os participantes (P1, P2...) com base na quantidade
    const initialAttendees = Array.from({ length: totalPeople }, (_, i) => ({
      id: i + 1,
      name: '',
      email: '',
      phone: '',
      addons: []
    }));
    setAttendees(initialAttendees);
  }, [totalPeople]);

  const addonsList = [
    { id: 'a1', name: 'Almoço Executivo', price: 45.00, icon: <Utensils className="h-4 w-4" /> },
    { id: 'a2', name: 'Jantar de Gala', price: 120.00, icon: <Utensils className="h-4 w-4" /> },
    { id: 'a3', name: 'Translado Hotel/Evento', price: 35.00, icon: <Bus className="h-4 w-4" /> },
  ];

  const toggleAddon = (attendeeIndex: number, addonId: string) => {
    const newAttendees = [...attendees];
    const currentAddons = newAttendees[attendeeIndex].addons;
    
    if (currentAddons.includes(addonId)) {
      newAttendees[attendeeIndex].addons = currentAddons.filter(id => id !== addonId);
    } else {
      newAttendees[attendeeIndex].addons = [...currentAddons, addonId];
    }
    setAttendees(newAttendees);
  };

  const updateAttendee = (index: number, field: keyof Attendee, value: string) => {
    const newAttendees = [...attendees];
    (newAttendees[index] as any)[field] = value;
    setAttendees(newAttendees);
  };

  const subtotalTickets = qty * (isDouble ? 280 : 150);
  const totalAddonsPrice = attendees.reduce((total, a) => 
    total + a.addons.reduce((at, aid) => 
      at + (addonsList.find(x => x.id === aid)?.price || 0), 0
    ), 0
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      <Navbar />
      
      <main className="max-w-6xl mx-auto py-12 px-4">
        {/* Header de Progresso */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mb-3">
              <span>Checkout</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">Participantes</span>
              <ChevronRight className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300">Pagamento</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Finalizar Inscrição 🏁</h1>
            <p className="text-gray-500 font-medium">Configure quem participará e seus respectivos adicionais.</p>
          </div>
          
          <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
               <TicketIcon className="h-6 w-6" />
            </div>
            <div>
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Seu Pedido</p>
               <p className="text-gray-900 font-bold text-lg">{qty}x {isDouble ? 'Ingresso Dupla' : 'Ingresso Individual'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Coluna da Esquerda: Dados de P1, P2... */}
          <div className="lg:col-span-2 space-y-8">
            {attendees.map((attendee, index) => (
              <section 
                key={attendee.id} 
                className="bg-white p-8 sm:p-10 rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-500 relative overflow-hidden" 
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Indicador de participante P1, P2... */}
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-8 py-2 rounded-bl-3xl font-black text-sm italic tracking-widest">
                  P{index + 1}
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gray-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border border-blue-100">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">
                      {index === 0 ? 'Dados do Titular' : `Acompanhante ${index + 1}`}
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Identifique quem usará este ingresso.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nome Completo (P{index + 1})</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={attendee.name}
                        onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 text-gray-900 font-bold focus:border-blue-500 outline-none transition-all placeholder:text-gray-200"
                        placeholder="Nome completo do participante"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={attendee.email}
                        onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 text-gray-900 font-bold focus:border-blue-500 outline-none transition-all placeholder:text-gray-200"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>

                  {/* Seleção de Adicionais por Pessoa */}
                  <div className="md:col-span-2 pt-6 mt-6 border-t border-gray-50">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                       <PlusCircle className="h-4 w-4 text-blue-500" /> Adicionais para P{index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addonsList.map((addon) => (
                        <div 
                          key={addon.id}
                          onClick={() => toggleAddon(index, addon.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                            attendee.addons.includes(addon.id)
                            ? 'border-blue-500 bg-blue-50/20 shadow-lg shadow-blue-50'
                            : 'border-gray-50 bg-white hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl transition-colors ${attendee.addons.includes(addon.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {addon.icon}
                            </div>
                            <div className="space-y-0.5">
                              <p className={`text-sm font-bold ${attendee.addons.includes(addon.id) ? 'text-gray-900' : 'text-gray-700'}`}>{addon.name}</p>
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">+ R$ {addon.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                            attendee.addons.includes(addon.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-100'
                          }`}>
                            {attendee.addons.includes(addon.id) && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Coluna da Direita: Resumo Financeiro */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
             <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-50 border border-gray-100 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
               
               <h3 className="text-xl font-black text-gray-900 mb-6 italic tracking-tight uppercase tracking-widest">Resumo do Pedido</h3>
               
               <div className="space-y-4 mb-8">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 font-medium">{qty}x {isDouble ? 'Ingresso Dupla' : 'Ingresso Individual'}</span>
                   <span className="font-black text-gray-900">R$ {subtotalTickets.toFixed(2)}</span>
                 </div>
                 
                 {/* Detalhamento dos Adicionais no Resumo */}
                 {attendees.some(a => a.addons.length > 0) && (
                   <div className="pt-4 border-t border-dashed border-gray-100 space-y-3">
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Serviços Adicionais</p>
                     {attendees.map((a, i) => (
                       a.addons.map(addonId => {
                         const addon = addonsList.find(x => x.id === addonId);
                         return (
                           <div key={`${i}-${addonId}`} className="flex justify-between items-center animate-in fade-in slide-in-from-right-2">
                             <span className="text-xs text-gray-400 font-bold">P{i+1}: {addon?.name}</span>
                             <span className="text-xs font-black text-gray-900">R$ {addon?.price.toFixed(2)}</span>
                           </div>
                         );
                       })
                     ))}
                   </div>
                 )}
               </div>

               <div className="bg-blue-600 p-6 rounded-[28px] mb-8 text-white shadow-xl shadow-blue-100 transform translate-y-0 hover:-translate-y-1 transition-transform">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Investido</span>
                 </div>
                 <div className="flex justify-between items-baseline">
                   <span className="text-sm font-bold opacity-80 italic">Check-in Br</span>
                   <span className="text-3xl font-black tracking-tight">
                     R$ {(subtotalTickets + totalAddonsPrice).toFixed(2)}
                   </span>
                 </div>
               </div>

                <button 
                  onClick={() => {
                    if (!session) {
                      const from = window.location.pathname + window.location.search;
                      router.push(`/register?from=${encodeURIComponent(from)}`);
                    } else {
                      alert('Processando seu pagamento seguro via Stripe... 🚀');
                    }
                  }}
                  className="w-full bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 group uppercase tracking-widest text-xs"
                >
                  {session ? 'Ir para o Pagamento' : 'Cadastrar e Finalizar'}
                  <CreditCard className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>

               <div className="mt-6 p-4 bg-red-50/50 rounded-2xl border border-red-50 flex items-start gap-3">
                 <AlertCircle className="h-4 w-4 text-red-400 mt-1" />
                 <p className="text-[9px] text-red-700 leading-relaxed font-bold">
                   AO FINALIZAR, VOCÊ CONCORDA COM OS TERMOS DE USO E POLÍTICA DE PRIVACIDADE DO EVENTO.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
