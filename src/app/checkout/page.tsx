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
  Check,
  PlusCircle,
  AlertCircle,
  Ticket as TicketIcon,
  Search,
  Settings,
  ShieldCheck,
  QrCode
} from 'lucide-react';

interface Attendee {
  id: number;
  name: string;
  email: string;
  customData: Record<string, string>;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black text-gray-500 italic uppercase tracking-widest">Preparando Checkout Premium... 🏁</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  
  // Lógica Dinâmica baseada nos novos Cenários (Kids, Dupla, VIP)
  const ticketType = searchParams.get('type') || 'INDIVIDUAL';
  const qty = parseInt(searchParams.get('qty') || '1');

  // MOCK das configurações do Organizador (O que vem do Banco de Dados agora)
  const config = {
    'KIDS': { label: 'Ingresso Kids', groupSize: 1, fields: ['Nome do Responsável', 'Alergias'], price: 80 },
    'DUPLA': { label: 'Ingresso Dupla Amigo', groupSize: 2, fields: ['Instagram', 'Idade'], price: 250 },
    'VIP': { label: 'Ingresso VIP Profissional', groupSize: 1, fields: ['Empresa', 'Profissão', 'LinkedIn'], price: 450 },
    'INDIVIDUAL': { label: 'Ingresso Individual', groupSize: 1, fields: [], price: 150 }
  }[ticketType] || { label: 'Ingresso', groupSize: 1, fields: [], price: 150 };

  const totalPeople = qty * config.groupSize;

  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const initialArr = Array.from({ length: totalPeople }, (_, i) => ({
      id: i + 1,
      name: '',
      email: '',
      customData: {}
    }));
    setAttendees(initialArr);
  }, [totalPeople]);

  const updateAttendee = (index: number, field: string, value: string, isCustom = false) => {
    const nextAttendeess = [...attendees];
    if (isCustom) {
      nextAttendeess[index].customData[field] = value;
    } else {
      (nextAttendeess[index] as any)[field] = value;
    }
    setAttendees(nextAttendeess);
  };

  const subtotal = qty * config.price;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      <Navbar />
      
      <main className="max-w-6xl mx-auto py-16 px-6">
        {/* Header Elite */}
        <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] text-blue-600 font-black uppercase tracking-[0.3em] mb-4 bg-white w-fit px-4 py-1.5 rounded-full border border-blue-50 shadow-sm italic">
               Check-in Individual 🏷️
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Finalizar Pedido 🏁</h1>
            <p className="text-gray-400 font-semibold text-lg max-w-lg">Configuramos formulários exclusivos para o seu tipo de ingresso.</p>
          </div>
          
          <div className="bg-white px-10 py-6 rounded-[32px] shadow-2xl shadow-blue-50 border border-gray-100 flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/5 rounded-bl-full transform group-hover:scale-110 transition-transform"></div>
            <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-xl shadow-blue-100">
               <TicketIcon className="h-8 w-8" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest space-y-1 block">Item Selecionado</p>
               <p className="text-gray-900 font-black text-2xl italic uppercase tracking-tighter">{qty}x {config.label}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Fichas de Identificação Progressiva */}
          <div className="lg:col-span-2 space-y-12">
            {attendees.map((attendee, index) => (
              <section 
                key={attendee.id} 
                className="bg-white p-10 sm:p-14 rounded-[56px] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-12 duration-700 relative overflow-hidden" 
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Badge de QR Code Individual */}
                <div className="absolute top-0 right-0 bg-black text-white px-10 py-3 rounded-bl-[40px] font-black text-xs italic tracking-widest uppercase flex items-center gap-2">
                  <QrCode className="h-4 w-4" /> Individual P{index + 1}
                </div>

                <div className="flex items-center gap-6 mb-12">
                   <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-blue-100 italic border-4 border-white">
                    {index + 1}
                   </div>
                   <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">
                      {index === 0 ? 'Titular do Pedido' : `Acompanhante ${index + 1}`}
                    </h2>
                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mt-1">Este dado ficará atrelado ao QR Code individual.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">NOME COMPLETO</label>
                    <input 
                      type="text" 
                      required
                      value={attendee.name}
                      onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                      className="w-full bg-gray-50 border-2 border-transparent p-5 rounded-[24px] text-gray-900 font-black text-lg focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-gray-200"
                      placeholder="Identificação Oficial"
                    />
                  </div>
                  
                  {/* Email só obrigatório para P1 no layout Kids? Não, o usuário pediu P1 completo, P2+ flex. 
                      No novo cenário 'Dupla Amigo', ele disse 'O sistema exige o preenchimento para as duas pessoas'. 
                  */}
                  {(index === 0 || config.fields.includes('Email Extra')) && (
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">EMAIL PRINCIPAL PARA QR CODE</label>
                      <input 
                        type="email" 
                        required
                        value={attendee.email}
                        onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-transparent p-5 rounded-[24px] text-gray-900 font-black text-lg focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-gray-200"
                        placeholder="onde enviaremos o acesso"
                      />
                    </div>
                  )}

                  {/* CAMPOS DINÂMICOS CONFIGURADOS PELO ORGANIZADOR */}
                  {config.fields.map((fieldName) => (
                    <div key={fieldName} className="md:col-span-2">
                      <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 ml-2">{fieldName}</label>
                      <input 
                        type="text" 
                        required
                        value={attendee.customData[fieldName] || ''}
                        onChange={(e) => updateAttendee(index, fieldName, e.target.value, true)}
                        className="w-full bg-blue-50/20 border-2 border-blue-50/50 p-5 rounded-[24px] text-gray-900 font-black text-lg focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-blue-100"
                        placeholder={`Preencha o ${fieldName.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Coluna Financeira Premium */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-32">
             <div className="bg-white p-10 rounded-[56px] shadow-2xl shadow-blue-100 border border-gray-100 relative overflow-hidden group translate-y-0 hover:-translate-y-2 transition-transform duration-500">
               <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
               <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter mb-8">Investimento</h3>
               
               <div className="space-y-6 mb-10">
                 <div className="flex justify-between items-center bg-gray-50 p-5 rounded-3xl border border-gray-100">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{config.label}</p>
                      <p className="text-gray-900 font-black italic">{qty} unidade(s)</p>
                    </div>
                    <p className="text-2xl font-black text-gray-900 tracking-tighteritalic italic">R$ {subtotal.toFixed(2)}</p>
                 </div>
                 
                 <div className="flex items-center gap-3 px-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Checkout Seguro &<br/>Criptografia de Dados</p>
                 </div>
               </div>

                <button 
                  onClick={() => alert(`Sistema Gerando ${totalPeople} QR Codes Individuais agora... 🚀`)}
                  className="w-full bg-blue-600 text-white font-black py-7 rounded-[32px] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-3xl shadow-blue-100 group uppercase tracking-[0.2em] italic text-sm"
                >
                  Confirmar & Pagar
                  <CreditCard className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>

               <div className="mt-8 flex items-center justify-center gap-2 grayscale opacity-30">
                  <Settings className="h-4 w-4 animate-spin-slow" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Check-in Br Engine v2.0</span>
               </div>
             </div>
          </div>
        </div>
      </main>
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
