'use client';

import { useState, useEffect } from 'react';
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
  Search,
  Check,
  Tag,
  PlusCircle,
  Settings2,
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

interface Addon {
  id: string;
  name: string;
  price: string;
  category: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 1. Dados Gerais (Restaurados)
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    showTimes: true,
    location: '',
    locationType: 'PHYSICAL',
    image: '',
    schedule: '',
  });

  // 2. Ingressos com Campos Dinâmicos (Integrados no Visual Clean)
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

  // 3. Adicionais (Restaurados)
  const [addons, setAddons] = useState<Addon[]>([
    { id: '1', name: 'Refeição Executiva', price: '', category: 'REFEIÇÃO' }
  ]);

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    const fieldName = prompt("Digite o nome da informação extra (Ex: CPF, Instagram, Tamanho de Camiseta):");
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

  const addAddon = () => {
    setAddons([...addons, { id: Date.now().toString(), name: '', price: '', category: 'REFEIÇÃO' }]);
  };

  const removeAddon = (id: string) => {
    setAddons(addons.filter(a => a.id !== id));
  };

  const searchAddress = async (query: string) => {
    if (query.length < 3) return;
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5&countrycodes=br`);
      const data = await resp.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de salvamento profissional
    setTimeout(() => {
      setLoading(false);
      alert('Evento de Elite Criado com Sucesso! 🏁');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24 font-sans text-gray-900">
      <Navbar />
      
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
            Criar Novo Evento
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Preencha as informações para lançar sua experiência.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Seção 1: Informações Gerais (Layout Original Clean) */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
               <Calendar className="h-5 w-5 text-blue-600" />
               <h2 className="text-xl font-semibold text-gray-900">Informações Gerais</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 ml-1">Capa do Evento (Link da Imagem)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/imagem-do-evento.jpg"
                    className="w-full rounded-xl border border-gray-100 p-4 pl-11 text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-200 bg-gray-50/30"
                    value={eventData.image}
                    onChange={(e) => setEventData({ ...eventData, image: e.target.value })}
                  />
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest ml-1 italic">Proporção ideal: 16:9 (ex: 1280x720px)</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 ml-1">Título do Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Encontro Nacional 2026"
                  className="w-full rounded-xl border border-gray-100 p-4 font-bold text-gray-900 focus:border-blue-500 outline-none bg-gray-50/30"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                />
              </div>

              {/* Datas e Horários (Restaurado) */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 p-6 rounded-2xl border border-gray-100">
                <div className="md:col-span-2 flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest pb-2 border-b border-gray-100">
                  <Clock className="h-4 w-4" /> Configurações de Tempo
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Início</label>
                   <input
                    type="datetime-local"
                    required
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none bg-white"
                    value={eventData.startDate}
                    onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Término</label>
                   <input
                    type="datetime-local"
                    required
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none bg-white"
                    value={eventData.endDate}
                    onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setEventData({ ...eventData, showTimes: !eventData.showTimes })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                      eventData.showTimes ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    {eventData.showTimes ? <CheckCircle2 className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {eventData.showTimes ? 'Horários: Exibição Ativada' : 'Ocultar horários no site'}
                  </button>
                </div>
              </div>

              {/* Localização (Restaurado com Autocomplete) */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-50">
                 <div className="flex gap-4">
                    {['PHYSICAL', 'ONLINE', 'TO_DEFINE'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEventData({ ...eventData, locationType: type })}
                        className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border ${
                          eventData.locationType === type ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
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
                         placeholder={eventData.locationType === 'PHYSICAL' ? "Pesquise o endereço físico..." : "Link do evento online"}
                         className="w-full rounded-xl border border-gray-200 p-4 text-gray-900 font-medium focus:border-blue-500 outline-none bg-gray-50/20"
                         value={eventData.location}
                         onChange={(e) => {
                           setEventData({ ...eventData, location: e.target.value });
                           if (eventData.locationType === 'PHYSICAL') searchAddress(e.target.value);
                         }}
                         onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                       />
                       {showSuggestions && addressSuggestions.length > 0 && eventData.locationType === 'PHYSICAL' && (
                         <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                           {addressSuggestions.map((s, i) => (
                             <button
                               key={i}
                               type="button"
                               onClick={() => {
                                 setEventData({ ...eventData, location: s.display_name });
                                 setShowSuggestions(false);
                               }}
                               className="w-full text-left p-3 text-xs text-gray-600 hover:bg-blue-50 border-b border-gray-50 last:border-0 font-medium"
                             >
                               {s.display_name}
                             </button>
                           ))}
                         </div>
                       )}
                    </div>
                 )}
              </div>

              <div className="md:col-span-2 space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 italic">Programação do Evento</label>
                 <textarea
                  placeholder="Descreva as atividades, horários e palestrantes..."
                  className="w-full rounded-xl border border-gray-100 p-4 text-gray-900 font-medium h-32 focus:border-blue-500 outline-none bg-gray-50/10 resize-none"
                  value={eventData.schedule}
                  onChange={(e) => setEventData({ ...eventData, schedule: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Seção 2: Ingressos (Visual Clean + Ficha Dinâmica) */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
               <div className="flex items-center gap-3">
                 <Users className="h-5 w-5 text-blue-600" />
                 <h2 className="text-xl font-semibold text-gray-900">Ingressos</h2>
               </div>
               <button type="button" onClick={addTicketType} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center gap-2">
                 <Plus className="h-4 w-4" /> Adicionar Tipo
               </button>
            </div>

            <div className="space-y-6">
              {ticketTypes.map((ticket, index) => (
                <div key={index} className="p-8 border border-gray-100 rounded-2xl bg-gray-50/5 hover:border-blue-100 transition-all space-y-8 relative group border-l-4 border-l-blue-500">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1 text-gray-400">Nome do Ingresso</label>
                        <input
                          type="text"
                          placeholder="Ex: Individual, Dupla Amigo..."
                          className="w-full rounded-xl border border-gray-100 p-4 font-bold text-gray-900 focus:border-blue-300 outline-none bg-white"
                          value={ticket.name}
                          onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].name = e.target.value;
                            setTicketTypes(newTypes);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Preço (R$)</label>
                        <input
                          type="number"
                          placeholder="0,00"
                          className="w-full rounded-xl border border-gray-100 p-4 font-bold text-gray-900 focus:border-blue-300 outline-none bg-white"
                          value={ticket.price}
                          onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].price = e.target.value;
                            setTicketTypes(newTypes);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1 italic text-blue-600">Integrantes</label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-gray-100 p-4 font-black text-gray-900 focus:border-blue-300 outline-none bg-white"
                          value={ticket.groupSize}
                          onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].groupSize = parseInt(e.target.value) || 1;
                            setTicketTypes(newTypes);
                          }}
                        />
                        <p className="text-[9px] text-gray-400 font-bold uppercase ml-1">Para {ticket.groupSize} QR Codes</p>
                      </div>
                   </div>

                   {/* Ficha do Participante (Visual Clean) */}
                   <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-5">
                      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                         <div className="flex items-center gap-2">
                           <UserPlus className="h-4 w-4 text-blue-500" />
                           <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider italic font-black">Coleta de Dados</h3>
                         </div>
                         <button 
                          type="button" 
                          onClick={() => addCustomField(index)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 uppercase tracking-widest group"
                        >
                          <PlusCircle className="h-4 w-4" /> Acrescentar Informação
                         </button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                         <span className="px-3 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-tight opacity-50 border border-gray-100">Nome (Padrão)</span>
                         <span className="px-3 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-tight opacity-50 border border-gray-100">Email (Padrão)</span>
                         
                         {ticket.customFields.map((field, fIdx) => (
                           <div key={fIdx} className="group relative flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-tight animate-in zoom-in-90">
                              {field.label}
                              <button onClick={() => removeCustomField(index, fIdx)} className="text-blue-300 hover:text-red-500 transition-colors">
                                <X className="h-3 w-3" />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>

                   {ticketTypes.length > 1 && (
                     <button onClick={() => removeTicketType(index)} className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-white p-2 rounded-lg shadow-sm">
                       <Trash2 className="h-4 w-4" />
                     </button>
                   )}
                </div>
              ))}
            </div>
          </section>

          {/* Seção 3: Adicionais (Restaurada) */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
               <div className="flex items-center gap-3">
                 <Tag className="h-5 w-5 text-gray-900" />
                 <h2 className="text-xl font-semibold text-gray-900 font-bold uppercase italic tracking-tighter">Adicionais Extras</h2>
               </div>
               <button type="button" onClick={addAddon} className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-100">
                 <Plus className="h-4 w-4" /> Novo Adicional
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addons.map((addon, idx) => (
                <div key={addon.id} className="p-6 border border-gray-50 rounded-2xl bg-gray-50/10 flex items-center gap-4 group relative hover:border-gray-200 transition-all">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Ex: Jantar de Sábado, Ônibus..."
                      className="w-full bg-transparent border-b border-gray-100 p-2 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 transition-all"
                      value={addon.name}
                      onChange={(e) => {
                        const newAddons = [...addons];
                        newAddons[idx].name = e.target.value;
                        setAddons(newAddons);
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Preço (Opcional)"
                      className="w-32 bg-transparent p-2 text-xs font-medium text-gray-400 outline-none"
                      value={addon.price}
                      onChange={(e) => {
                        const newAddons = [...addons];
                        newAddons[idx].price = e.target.value;
                        setAddons(newAddons);
                      }}
                    />
                  </div>
                  <button onClick={() => removeAddon(addon.id)} className="text-gray-200 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all bg-white rounded-lg shadow-sm">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <footer className="pt-10 flex gap-4">
             <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white font-bold py-5 rounded-2xl hover:bg-gray-900 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 uppercase tracking-[0.2em] italic text-sm"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="h-5 w-5" /> Salvar Configurações</>}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
