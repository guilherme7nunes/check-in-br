'use client';

import { useState, useRef, useEffect } from 'react';
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
  Search,
  Check,
  Tag,
  PlusCircle,
  Settings2,
  UploadCloud,
  ChevronRight,
  Info
} from 'lucide-react';

interface CustomField {
  label: string;
  required: boolean;
}

interface TicketType {
  name: string;
  price: string;
  description: string;
  capacity: string;
  isGroup: boolean;
  groupSize: number;
  customFields: CustomField[];
  addons: Addon[];
}

interface Addon {
  id: string;
  name: string;
  price: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  // 1. Dados Gerais do Evento
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    schedule: '',
    startDate: '',
    endDate: '',
    showTimes: true,
    location: '',
    locationType: 'PHYSICAL' as 'PHYSICAL' | 'ONLINE' | 'TO_DEFINE',
    image: null as string | null, // Base64 preview
  });

  // 2. Gestão de Ingressos
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { 
      name: 'Individual', 
      price: '', 
      description: '',
      capacity: '', 
      isGroup: false, 
      groupSize: 1, 
      customFields: [],
      addons: [] 
    }
  ]);

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auxiliares de Imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData({ ...eventData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Auxiliares de Endereço (Nominatim grátis)
  const searchAddress = async (query: string) => {
    if (query.length < 3) return;
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5&countrycodes=br`);
      const data = await resp.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (e) {}
  };

  // Funções de Gerenciamento de Ingressos
  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { 
      name: '', 
      price: '', 
      description: '',
      capacity: '', 
      isGroup: false, 
      groupSize: 1, 
      customFields: [],
      addons: []
    }]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const addCustomField = (ticketIndex: number) => {
    const fieldName = prompt("Nome da informação desejada (Ex: CPF, Camiseta):");
    if (!fieldName) return;
    const newTypes = [...ticketTypes];
    newTypes[ticketIndex].customFields.push({ label: fieldName, required: true });
    setTicketTypes(newTypes);
  };

  const removeCustomField = (tIdx: number, fIdx: number) => {
    const newTypes = [...ticketTypes];
    newTypes[tIdx].customFields.splice(fIdx, 1);
    setTicketTypes(newTypes);
  };

  // Complementos por Ingresso
  const addAddonInTicket = (tIdx: number) => {
    const name = prompt("Nome do complemento (Ex: Almoço Quinta):");
    const price = prompt("Preço (Opcional):");
    if (!name) return;
    const newTypes = [...ticketTypes];
    newTypes[tIdx].addons.push({ id: Date.now().toString(), name, price: price || '0' });
    setTicketTypes(newTypes);
  };

  const removeAddonFromTicket = (tIdx: number, aIdx: number) => {
    const newTypes = [...ticketTypes];
    newTypes[tIdx].addons.splice(aIdx, 1);
    setTicketTypes(newTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Integração com Backend/Prisma real
    setTimeout(() => {
      setLoading(false);
      alert('Evento de Elite Criado com Sucesso!');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] pb-24 font-sans text-slate-900 border-t-8 border-slate-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <header className="mb-12 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Configurar Evento</h1>
          <p className="text-slate-500 font-medium">Preencha os detalhes para lançar sua organização na plataforma.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* SEÇÃO 1: INFORMAÇÕES GERAIS */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Info className="h-5 w-5 text-slate-400" /> Informações Gerais
              </h2>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Capa do Evento */}
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Capa do Evento</label>
                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
                {!eventData.image ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer bg-slate-50/50"
                  >
                    <UploadCloud className="h-10 w-10 text-slate-200 mb-2" />
                    <p className="text-slate-400 text-sm font-semibold">Clique para subir a capa (.jpg, .png)</p>
                  </div>
                ) : (
                  <div className="relative h-64 rounded-2xl overflow-hidden group border border-slate-100">
                    <img src={eventData.image} className="w-full h-full object-cover" alt="Capa" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100">Trocar</button>
                      <button type="button" onClick={() => setEventData({...eventData, image: null})} className="bg-white text-red-500 p-2 rounded-lg hover:bg-red-50"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>

              {/* Título e Descrição */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Título do Evento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Encontro Nacional de Dirigentes"
                    className="w-full rounded-xl border border-slate-200 p-4 text-slate-900 font-semibold focus:border-slate-900 outline-none transition-all"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Descrição Sobre o Evento (Opcional)</label>
                  <textarea
                    placeholder="Descreva os objetivos e detalhes do evento..."
                    className="w-full h-32 rounded-xl border border-slate-200 p-4 text-slate-900 font-medium focus:border-slate-900 outline-none transition-all resize-none"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cronograma do Evento (Opcional)</label>
                  <textarea
                    placeholder="Ex: 08:00 - Abertura, 12:00 - Almoço..."
                    className="w-full h-32 rounded-xl border border-slate-200 p-4 text-slate-900 font-medium focus:border-slate-900 outline-none transition-all resize-none"
                    value={eventData.schedule}
                    onChange={(e) => setEventData({ ...eventData, schedule: e.target.value })}
                  />
                </div>
              </div>

              {/* Data e Localização */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Início</label>
                      <input type="datetime-local" className="w-full p-4 rounded-xl border border-slate-200 font-bold focus:border-slate-900 outline-none" value={eventData.startDate} onChange={(e) => setEventData({...eventData, startDate: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Encerramento</label>
                      <input type="datetime-local" className="w-full p-4 rounded-xl border border-slate-200 font-bold focus:border-slate-900 outline-none" value={eventData.endDate} onChange={(e) => setEventData({...eventData, endDate: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                       <button 
                        type="button" 
                        onClick={() => setEventData({...eventData, showTimes: !eventData.showTimes})}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                          eventData.showTimes ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'
                        }`}
                       >
                         {eventData.showTimes ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                         {eventData.showTimes ? 'Horários Visíveis' : 'Exibir Horários ao Público?'}
                       </button>
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-4">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Localização do Evento</label>
                    <div className="flex gap-2">
                      {['PHYSICAL', 'ONLINE', 'TO_DEFINE'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setEventData({...eventData, locationType: type as any})}
                          className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all ${
                            eventData.locationType === type ? 'bg-slate-100 border-slate-900 text-slate-900 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {type === 'PHYSICAL' ? '📍 Físico' : type === 'ONLINE' ? '🌐 Online' : '❓ A Definir'}
                        </button>
                      ))}
                    </div>

                    {eventData.locationType !== 'TO_DEFINE' && (
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder={eventData.locationType === 'PHYSICAL' ? "Digite o nome do local ou endereço..." : "Link do evento online"}
                          className="w-full p-4 rounded-xl border border-slate-200 font-medium focus:border-slate-900 outline-none bg-white"
                          value={eventData.location}
                          onChange={(e) => {
                            setEventData({...eventData, location: e.target.value});
                            if (eventData.locationType === 'PHYSICAL') searchAddress(e.target.value);
                          }}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        {showSuggestions && addressSuggestions.length > 0 && eventData.locationType === 'PHYSICAL' && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden">
                            {addressSuggestions.map((s, i) => (
                              <button key={i} type="button" onClick={() => { setEventData({...eventData, location: s.display_name}); setShowSuggestions(false); }} className="w-full p-3 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 border-b border-slate-50 last:border-0">{s.display_name}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO 2: INGRESSOS (DINÂMICO & CLEAN) */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <Tag className="h-5 w-5 text-slate-400" /> Ingressos do Evento
                </h2>
                <button type="button" onClick={addTicketType} className="bg-slate-50 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                  + Criar Ingresso
                </button>
             </div>

             <div className="p-8 space-y-6">
                {ticketTypes.map((ticket, index) => (
                  <div key={index} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/20 space-y-8 relative group">
                     {/* Dados Básicos do Ingresso */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome do Ingresso</label>
                           <input type="text" className="w-full p-3 rounded-lg border border-slate-200 font-bold focus:border-slate-900 outline-none bg-white" placeholder="Ex: Individual, Dupla Amigo..." value={ticket.name} onChange={(e) => { const n = [...ticketTypes]; n[index].name = e.target.value; setTicketTypes(n); }} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor Unitário</label>
                           <input type="number" className="w-full p-3 rounded-lg border border-slate-200 font-bold focus:border-slate-900 outline-none bg-white font-mono" placeholder="0,00" value={ticket.price} onChange={(e) => { const n = [...ticketTypes]; n[index].price = e.target.value; setTicketTypes(n); }} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Integrantes</label>
                           <input type="number" className="w-full p-3 rounded-lg border border-slate-200 font-bold focus:border-slate-900 outline-none bg-white" value={ticket.groupSize} onChange={(e) => { const n = [...ticketTypes]; n[index].groupSize = parseInt(e.target.value) || 1; setTicketTypes(n); }} />
                        </div>
                        <div className="md:col-span-4 space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição do Ingresso (Opcional)</label>
                           <input type="text" className="w-full p-3 rounded-lg border border-slate-200 font-medium focus:border-slate-900 outline-none bg-white" placeholder="Breve resumo sobre o que este ingresso contempla..." value={ticket.description} onChange={(e) => { const n = [...ticketTypes]; n[index].description = e.target.value; setTicketTypes(n); }} />
                        </div>
                     </div>

                     {/* Informações dos Participantes */}
                     <div className="bg-white p-6 rounded-xl border border-slate-100 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Coleta de Dados por Pessoa</h3>
                           <button type="button" onClick={() => addCustomField(index)} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">+ Criar Nova Informação</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-tight opacity-70 italic">Nome Completo (Mínimo)</span>
                           {ticket.customFields.map((f, fi) => (
                             <div key={fi} className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-tight flex items-center gap-2">
                                {f.label}
                                <button type="button" onClick={() => removeCustomField(index, fi)} className="text-blue-300 hover:text-red-500"><X className="h-3 w-3" /></button>
                             </div>
                           ))}
                        </div>
                     </div>

                     {/* Complementos (Addons) */}
                     <div className="bg-slate-50/50 p-6 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Complementos Opcionais</h3>
                           <button type="button" onClick={() => addAddonInTicket(index)} className="text-[10px] font-bold text-slate-900 hover:underline uppercase tracking-widest">+ Criar item complementar</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {ticket.addons.map((a, ai) => (
                             <div key={a.id} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm">
                                <div>
                                   <p className="text-xs font-bold text-slate-900">{a.name}</p>
                                   <p className="text-[10px] text-slate-400 font-mono">R$ {parseFloat(a.price).toFixed(2)}</p>
                                </div>
                                <button type="button" onClick={() => removeAddonFromTicket(index, ai)} className="text-slate-200 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                             </div>
                           ))}
                        </div>
                     </div>

                     <button type="button" onClick={() => removeTicketType(index)} className="absolute top-4 right-4 text-slate-200 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
             </div>
          </section>

          <footer className="pt-8">
             <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-extrabold py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-100 uppercase tracking-widest italic text-sm"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Finalizar Criação do Evento <ChevronRight className="h-5 w-5" /></>}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
