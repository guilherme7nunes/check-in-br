'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  CheckCircle2, 
  Users,
  Loader2,
  X,
  Globe,
  Clock,
  Eye,
  EyeOff,
  HelpCircle,
  Utensils,
  Search,
  Check,
  Tag,
  Settings2,
  QrCode,
  UserPlus
} from 'lucide-react';

interface CustomField {
  label: string;
  required: boolean;
}

interface TicketType {
  name: string;
  price: string;
  capacity: string;
  isGroup: boolean;
  groupSize: number;
  customFields: CustomField[];
}

export default function NewEventPage() {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    showTimes: true,
    location: '',
    locationType: 'PHYSICAL',
    image: '',
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { 
      name: 'Individual', 
      price: '', 
      capacity: '', 
      isGroup: false, 
      groupSize: 1, 
      customFields: [] 
    }
  ]);

  const [addons, setAddons] = useState([{ name: '', price: '', category: 'MEAL' }]);

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { 
      name: '', 
      price: '', 
      capacity: '', 
      isGroup: false, 
      groupSize: 1, 
      customFields: [] 
    }]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const addCustomField = (ticketIndex: number) => {
    const fieldName = prompt("Digite o nome da informação desejada (Ex: Profissão, Tamanho de Camiseta, Instagram):");
    if (!fieldName) return;

    const newTypes = [...ticketTypes];
    newTypes[ticketIndex].customFields.push({ label: fieldName, required: true });
    setTicketTypes(newTypes);
  };

  const removeCustomField = (ticketIndex: number, fieldIndex: number) => {
    const newTypes = [...ticketTypes];
    newTypes[ticketIndex].customFields.splice(fieldIndex, 1);
    setTicketTypes(newTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de salvamento
    setTimeout(() => {
      setLoading(false);
      alert('Evento de Elite Criado! QR Codes Individuais e Formulários Dinâmicos Prontos. 🏁🏆');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      <Navbar />
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100 italic">
               Check-in Br PRO
             </div>
             <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Gerenciador de Ingressos 🏁</h1>
             <p className="text-gray-500 font-medium">Flexibilidade total de dados e check-in individualizado.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Sessão 1: Detalhes do Evento */}
          <section className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
            <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Informações Gerais</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Onde e quando a mágica acontece</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Título do Evento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Encontro Nacional 2026"
                    className="w-full rounded-3xl border-2 border-gray-50 p-5 text-gray-900 font-black text-lg focus:border-blue-500 outline-none transition-all placeholder:text-gray-200"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  />
               </div>

               <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-8 rounded-[32px] border-2 border-dashed border-gray-100">
                  {/* Datas */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Data Início</label>
                    <input type="datetime-local" className="w-full rounded-2xl border-2 border-white p-4 font-bold outline-none focus:border-blue-500 shadow-sm" value={eventData.startDate} onChange={(e) => setEventData({...eventData, startDate: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Data Fim</label>
                    <input type="datetime-local" className="w-full rounded-2xl border-2 border-white p-4 font-bold outline-none focus:border-blue-500 shadow-sm" value={eventData.endDate} onChange={(e) => setEventData({...eventData, endDate: e.target.value})} />
                  </div>
               </div>
            </div>
          </section>

          {/* Sessão 2: Configuração Dinâmica de Ingressos */}
          <section className="space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-black text-white p-3 rounded-2xl">
                    <Settings2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">Grade de Ingressos</h2>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em]">QR Codes Individuais Ativados 🏷️</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addTicketType}
                  className="bg-blue-600 text-white px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-blue-100"
                >
                  <Plus className="h-5 w-5" /> Adicionar Tipo
                </button>
             </div>

             <div className="space-y-8">
               {ticketTypes.map((ticket, tIdx) => (
                 <div key={tIdx} className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 space-y-10 relative md:border-l-[16px] md:border-l-blue-600 hover:shadow-xl hover:shadow-blue-50 transition-all group animate-in slide-in-from-bottom-6 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Ingresso</label>
                          <input
                            type="text"
                            placeholder="Ex: Dupla Amigo"
                            className="w-full rounded-2xl border-2 border-gray-50 p-4 text-gray-900 font-black focus:border-blue-500 outline-none bg-white"
                            value={ticket.name}
                            onChange={(e) => {
                              const newTypes = [...ticketTypes];
                              newTypes[tIdx].name = e.target.value;
                              setTicketTypes(newTypes);
                            }}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preço unitário</label>
                          <input
                            type="number"
                            placeholder="R$ 0,00"
                            className="w-full rounded-2xl border-2 border-gray-50 p-4 text-gray-900 font-black focus:border-blue-500 outline-none bg-white font-mono"
                            value={ticket.price}
                            onChange={(e) => {
                              const newTypes = [...ticketTypes];
                              newTypes[tIdx].price = e.target.value;
                              setTicketTypes(newTypes);
                            }}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic text-blue-600">Ocupantes / PAX</label>
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-blue-500" />
                            <input
                              type="number"
                              className="w-full rounded-2xl border-2 border-blue-50 p-4 text-gray-900 font-black focus:border-blue-500 outline-none bg-blue-50/20"
                              value={ticket.groupSize}
                              onChange={(e) => {
                                const newTypes = [...ticketTypes];
                                newTypes[tIdx].groupSize = parseInt(e.target.value) || 1;
                                newTypes[tIdx].isGroup = newTypes[tIdx].groupSize > 1;
                                setTicketTypes(newTypes);
                              }}
                            />
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase ml-1">Gerará {ticket.groupSize} QR Codes</p>
                       </div>
                    </div>

                    {/* Módulo Dinâmico de Campos Customizados */}
                    <div className="bg-gray-50/50 p-8 rounded-[32px] border-2 border-white space-y-6">
                       <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                          <div className="flex items-center gap-3">
                             <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                               <UserPlus className="h-4 w-4 text-blue-600" />
                             </div>
                             <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-widest">Ficha do Participante</h3>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => addCustomField(tIdx)}
                            className="bg-black text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
                          >
                            <Plus className="h-3 w-3" /> Adicionar Campo Customizado
                          </button>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Campos Fixos para o Primeiro Inscrito */}
                          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm opacity-60 flex items-center justify-between group">
                             <div className="flex flex-col">
                               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Campo Padrão</span>
                               <span className="text-xs font-black text-gray-900 uppercase">NOME COMPLETO</span>
                             </div>
                             <Check className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm opacity-60 flex items-center justify-between group">
                             <div className="flex flex-col">
                               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Campo Padrão</span>
                               <span className="text-xs font-black text-gray-900 uppercase">EMAIL</span>
                             </div>
                             <Check className="h-4 w-4 text-green-500" />
                          </div>

                          {/* Campos Customizados Adicionados */}
                          {ticket.customFields.map((field, fIdx) => (
                            <div key={fIdx} className="p-4 bg-blue-600 text-white rounded-2xl border border-blue-500 shadow-lg flex items-center justify-between animate-in zoom-in-95 duration-200 group">
                               <div className="flex flex-col">
                                 <span className="text-[9px] font-black opacity-70 uppercase tracking-widest italic">Coletar Informação</span>
                                 <span className="text-xs font-black uppercase tracking-tight">{field.label}</span>
                               </div>
                               <button 
                                onClick={() => removeCustomField(tIdx, fIdx)}
                                className="bg-white/20 p-2 rounded-xl hover:bg-white/40 transition-colors"
                               >
                                 <X className="h-4 w-4" />
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>

                    {ticketTypes.length > 1 && (
                      <button onClick={() => removeTicketType(tIdx)} className="absolute top-10 right-10 text-gray-300 hover:text-red-500 transition-colors bg-white p-3 rounded-full shadow-sm">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                 </div>
               ))}
             </div>
          </section>

          <footer className="flex items-center justify-between p-10 bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-blue-100 sticky bottom-8 z-40 transform translate-y-0 group">
             <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-3xl text-blue-600 animate-pulse">
                  <QrCode className="h-8 w-8" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Segurança & Controle</p>
                   <p className="text-gray-900 font-black italic uppercase tracking-tighter">Check-in Individual Ready 🛡️</p>
                </div>
             </div>
             
            <div className="flex gap-4">
              <button
                type="button"
                className="px-8 py-5 rounded-3xl border-2 border-gray-50 text-sm font-black text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-5 rounded-3xl bg-blue-600 text-sm font-black text-white hover:bg-black transition-all shadow-2xl shadow-blue-100 flex items-center gap-4 uppercase tracking-[0.2em] italic"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Lançar Plataforma 🏁'}
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
}
