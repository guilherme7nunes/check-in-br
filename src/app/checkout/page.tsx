'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticket');
  
  // Mock do ingresso selecionado
  const isDouble = ticketId === '2';
  
  const [attendees, setAttendees] = useState(
    isDouble ? [
      { id: 1, name: '', email: '', addons: [] },
      { id: 2, name: '', email: '', addons: [] }
    ] : [
      { id: 1, name: '', email: '', addons: [] }
    ]
  );

  const addonsList = [
    { id: 'a1', name: 'Jantar Quinta-feira', price: 60.00, icon: <Utensils className="h-4 w-4" /> },
    { id: 'a2', name: 'Almoço Sexta-feira', price: 45.00, icon: <Utensils className="h-4 w-4" /> },
    { id: 'a3', name: 'Translado Ônibus (Hoteis Centro)', price: 30.00, icon: <Bus className="h-4 w-4" /> },
  ];

  const toggleAddon = (attendeeIndex: number, addonId: string) => {
    const newAttendees = [...attendees];
    const currentAddons = newAttendees[attendeeIndex].addons as string[];
    
    if (currentAddons.includes(addonId)) {
      newAttendees[attendeeIndex].addons = currentAddons.filter(id => id !== addonId);
    } else {
      newAttendees[attendeeIndex].addons = [...currentAddons, addonId];
    }
    setAttendees(newAttendees);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">
            <span>Seleção</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 underline underline-offset-4 decoration-blue-600">Inscrição</span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <span className="text-gray-400">Pagamento</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Inscrição</h1>
          <p className="text-gray-600">Preencha os dados dos participantes e adicione serviços extras se desejar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {attendees.map((attendee, index) => (
              <section key={attendee.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {index === 0 ? 'Dados do Titular' : 'Dados do Acompanhante'}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Como no documento"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                        type="email" 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Para receber o ingresso"
                      />
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
                       Serviços Adicionais (Individual)
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {addonsList.map((addon) => (
                        <div 
                          key={addon.id}
                          onClick={() => toggleAddon(index, addon.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            (attendee.addons as string[]).includes(addon.id)
                            ? 'border-blue-500 bg-blue-50/50'
                            : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${(attendee.addons as string[]).includes(addon.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {addon.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{addon.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">+ R$ {addon.price.toFixed(2)}</span>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                              (attendee.addons as string[]).includes(addon.id)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-200'
                            }`}>
                              {(attendee.addons as string[]).includes(addon.id) && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Resumo e Pagamento */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-28">
               <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-50">Total do Pedido</h3>
               
               <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">1x {isDouble ? 'Ingresso em Dupla' : 'Ingresso Individual'}</span>
                   <span className="font-bold text-gray-900">R$ {isDouble ? '250,00' : '150,00'}</span>
                 </div>
                 
                 {/* Listar Adicionais Selecionados */}
                 {attendees.some(a => a.addons.length > 0) && (
                   <div className="pt-3 border-t border-gray-50 space-y-2">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Serviços Adicionais</p>
                     {attendees.map((a, i) => (
                       (a.addons as string[]).map(addonId => {
                         const addon = addonsList.find(x => x.id === addonId);
                         return (
                           <div key={`${i}-${addonId}`} className="flex justify-between text-xs">
                             <span className="text-gray-500">P{i+1}: {addon?.name}</span>
                             <span className="font-semibold text-gray-700">R$ {addon?.price.toFixed(2)}</span>
                           </div>
                         );
                       })
                     ))}
                   </div>
                 )}
               </div>

               <div className="bg-blue-50 p-4 rounded-xl mb-6">
                 <div className="flex justify-between items-center text-blue-900">
                   <span className="font-bold text-lg">Total</span>
                   <span className="font-black text-2xl">
                     R$ {(
                       (isDouble ? 250 : 150) + 
                       attendees.reduce((total, a) => total + a.addons.reduce((at, aid) => at + (addonsList.find(x => x.id === aid)?.price || 0), 0), 0)
                     ).toFixed(2)}
                   </span>
                 </div>
               </div>

               <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg">
                 Ir para o Pagamento (Stripe)
                 <CreditCard className="h-5 w-5" />
               </button>

               <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
                 <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                 <p className="text-[10px] text-red-800 leading-tight font-medium">
                   Ao clicar em "Ir para o Pagamento", você confirma estar de acordo com os termos da LGPD e as regras do organizador.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
