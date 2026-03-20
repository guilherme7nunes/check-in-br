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
  Save,
  Loader2,
  Upload,
  X,
  Globe,
  Clock,
  Eye,
  EyeOff,
  HelpCircle,
  Utensils,
  Search,
  Check,
  Briefcase,
  Smartphone,
  CreditCard,
  Building,
  Mail,
  UserPlus
} from 'lucide-react';

export default function NewEventPage() {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    showTimes: true,
    location: '',
    locationType: 'PHYSICAL', // PHYSICAL, ONLINE, TO_DEFINE
    image: '',
    schedule: '',
  });

  const [ticketTypes, setTicketTypes] = useState([
    { 
      name: 'Individual', 
      price: '', 
      capacity: '', 
      isGroup: false, 
      groupSize: 1, 
      extraFields: [] // Campos opcionais acrescentados pelo organizador
    }
  ]);

  const [addons, setAddons] = useState([
    { name: '', price: '', category: 'MEAL' }
  ]);

  // Autocomplete de Endereço Local
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=br&limit=5`);
      const data = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

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

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { 
      name: '', 
      price: '', 
      capacity: '', 
      isGroup: false, 
      groupSize: 1, 
      extraFields: [] 
    }]);
  };

  const toggleExtraField = (index: number, field: string) => {
    const newTypes = [...ticketTypes];
    const fields = newTypes[index].extraFields;
    
    if (fields.includes(field)) {
      newTypes[index].extraFields = fields.filter(f => f !== field);
    } else {
      newTypes[index].extraFields = [...fields, field];
    }
    setTicketTypes(newTypes);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const addAddon = () => {
    setAddons([...addons, { name: '', price: '', category: 'MEAL' }]);
  };

  const removeAddon = (index: number) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Evento configurado com a regra Inscrição Ágil (P1: Nome/Email, P2+: Nome + Extras)! 🏁');
    }, 1500);
  };

  const availableExtraFields = [
    { id: 'email_extra', label: 'Email (Acompanhantes)', icon: <Mail className="h-3 w-3" /> },
    { id: 'phone', label: 'Telefone', icon: <Smartphone className="h-3.5 w-3.5" /> },
    { id: 'cpf', label: 'CPF/Documento', icon: <CreditCard className="h-3.5 w-3.5" /> },
    { id: 'address', label: 'Endereço', icon: <MapPin className="h-3.5 w-3.5" /> },
    { id: 'occupation', label: 'Profissão', icon: <Briefcase className="h-3.5 w-3.5" /> },
    { id: 'company', label: 'Empresa', icon: <Building className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight italic">Novo Evento 🏁</h1>
          <p className="text-gray-500 mt-2 font-medium">Inscrição Inteligente: P1 completo, acompanhantes ágeis.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sessão 1: Informações Gerais */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Informações Gerais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capa do Evento */}
              <div className="md:col-span-2 space-y-3">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capa do Evento (Recomendado 16:9)</label>
                 <div className={`relative h-64 w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${
                   eventData.image ? 'border-blue-400 bg-blue-50/5' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-200'
                 }`}>
                   {eventData.image ? (
                     <>
                       <img src={eventData.image} alt="Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                         <label className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-lg hover:bg-gray-50">
                           Trocar Imagem
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                         </label>
                         <button onClick={() => setEventData({ ...eventData, image: '' })} className="bg-white text-red-600 p-2 rounded-lg shadow-lg hover:bg-red-50">
                           <Trash2 className="h-4 w-4" />
                         </button>
                       </div>
                     </>
                   ) : (
                     <label className="cursor-pointer flex flex-col items-center gap-3 p-8 text-center bg-transparent w-full h-full justify-center group">
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-500 transition-transform bg-white/80 backdrop-blur-sm group-hover:scale-110">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-700 font-bold">Subir capa do computador</p>
                          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">1920x1080px • 16:9</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     </label>
                   )}
                 </div>
              </div>

              {/* Título */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Título do Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Encontro Nacional da FE. 2026"
                  className="w-full rounded-xl border border-gray-200 p-4 text-gray-900 font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-200 bg-white"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                />
              </div>

              {/* Datas e Chave de Horários */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30 p-6 rounded-2xl border border-gray-100">
                <div className="md:col-span-2 flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2 text-gray-600 font-bold text-xs uppercase tracking-wider">
                     <Clock className="h-4 w-4" /> Período do Evento
                   </div>
                   <button 
                    type="button"
                    onClick={() => setEventData({ ...eventData, showTimes: !eventData.showTimes })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border ${
                      eventData.showTimes ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-white border-gray-200 text-gray-400'
                    }`}
                   >
                     {eventData.showTimes ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                     {eventData.showTimes ? 'Horários: Visíveis' : 'Horários: Ocultos'}
                   </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Inicia em</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full rounded-xl border border-gray-200 p-3 text-gray-900 font-bold focus:border-blue-500 outline-none bg-white"
                    value={eventData.startDate}
                    onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Termina em</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full rounded-xl border border-gray-200 p-3 text-gray-900 font-bold focus:border-blue-500 outline-none bg-white"
                    value={eventData.endDate}
                    onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Localização com Autocomplete */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-50 relative">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Local do Evento</label>
                <div className="flex gap-2">
                  {[
                    { id: 'PHYSICAL', label: 'Físico', icon: <MapPin className="h-4 w-4" /> },
                    { id: 'ONLINE', label: 'Online', icon: <Globe className="h-4 w-4" /> },
                    { id: 'TO_DEFINE', label: 'A Definir', icon: <HelpCircle className="h-4 w-4" /> }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setEventData({ ...eventData, locationType: type.id, location: type.id === 'TO_DEFINE' ? 'A Definir' : '' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                        eventData.locationType === type.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
                
                {eventData.locationType !== 'TO_DEFINE' && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                       <Search className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder={eventData.locationType === 'PHYSICAL' ? "Digite endereços sugeridos pelo sistema..." : "Link da reunião ou plataforma"}
                      className="w-full rounded-xl border border-gray-200 p-4 pl-11 text-gray-900 font-bold focus:border-blue-500 outline-none transition-all placeholder:text-gray-200 bg-white"
                      value={eventData.location}
                      onChange={(e) => {
                        setEventData({ ...eventData, location: e.target.value });
                        if (eventData.locationType === 'PHYSICAL') searchAddress(e.target.value);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    
                    {/* Sugestões de Endereço */}
                    {showSuggestions && addressSuggestions.length > 0 && eventData.locationType === 'PHYSICAL' && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {addressSuggestions.map((suggestion, idx) => (
                           <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setEventData({ ...eventData, location: suggestion.display_name });
                              setAddressSuggestions([]);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-start gap-3 transition-colors group"
                           >
                             <MapPin className="h-4 w-4 mt-1 text-gray-400 group-hover:text-blue-500" />
                             <div>
                                <p className="text-sm font-bold text-gray-900 leading-tight">{suggestion.display_name.split(',')[0]}</p>
                                <p className="text-[10px] text-gray-400 leading-tight truncate max-w-sm">{suggestion.display_name}</p>
                             </div>
                           </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Seção 2: Tipos de Ingressos */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 italic font-black">Configuração de Ingressos 🎟️</h2>
              </div>
              <button
                type="button"
                onClick={addTicketType}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Adicionar Tipo
              </button>
            </div>
            
            <div className="space-y-6">
              {ticketTypes.map((ticket, index) => (
                <div key={index} className="p-8 border border-gray-100 rounded-3xl bg-gray-50/10 space-y-8 relative group border-l-8 border-l-blue-500 hover:border-blue-100 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nome do Ingresso</label>
                      <input
                        type="text"
                        placeholder="Ex: Individual, Duplo..."
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 font-bold focus:border-blue-300 outline-none bg-white"
                        value={ticket.name}
                        onChange={(e) => {
                          const newTypes = [...ticketTypes];
                          newTypes[index].name = e.target.value;
                          setTicketTypes(newTypes);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        placeholder="0,00"
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 font-bold focus:border-blue-300 outline-none bg-white"
                        value={ticket.price}
                        onChange={(e) => {
                          const newTypes = [...ticketTypes];
                          newTypes[index].price = e.target.value;
                          setTicketTypes(newTypes);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-gray-300 text-blue-600"
                          checked={ticket.isGroup}
                          onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].isGroup = e.target.checked;
                            if (!e.target.checked) newTypes[index].groupSize = 1;
                            setTicketTypes(newTypes);
                          }}
                        />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grupo/Promo</span>
                      </label>
                      {ticket.isGroup && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400">Pessoas:</span>
                          <input
                            type="number"
                            className="w-16 rounded-lg border border-gray-200 p-2 text-xs text-gray-900 font-bold bg-white"
                            value={ticket.groupSize}
                            onChange={(e) => {
                              const newTypes = [...ticketTypes];
                              newTypes[index].groupSize = parseInt(e.target.value) || 1;
                              setTicketTypes(newTypes);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NOVO: Painel de Informações Inscrição Ágil */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.1em] flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-blue-500" /> Regras de Coleta de Dados
                      </p>
                      <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-green-100">
                        Inscrição Ágil Ativada
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* P1 Section */}
                      <div className="flex-1 p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                         <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 italic">P1 (Titular - Obrigatório)</p>
                         <div className="flex flex-wrap gap-2 text-[10px] font-black">
                            <span className="px-2 py-1 bg-white border border-gray-200 text-gray-400 rounded-md">NOME</span>
                            <span className="px-2 py-1 bg-white border border-gray-200 text-gray-400 rounded-md">EMAIL</span>
                            <span className="text-blue-600 self-center">+ EXTRAS</span>
                         </div>
                      </div>

                      {/* P2+ Section */}
                      <div className="flex-1 p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                         <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 italic">P2 e Acompanhantes (Mínimo)</p>
                         <div className="flex flex-wrap gap-2 text-[10px] font-black">
                            <span className="px-2 py-1 bg-white border border-gray-200 text-gray-400 rounded-md">NOME</span>
                            <span className="text-blue-600 self-center">+ EXTRAS</span>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Acrescentar Informações (Opcionais ou Obrigatórias):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availableExtraFields.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleExtraField(index, opt.id)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all border-2 ${
                              ticket.extraFields.includes(opt.id)
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                              : 'bg-white border-gray-50 text-gray-400 hover:border-blue-100 hover:text-blue-500'
                            }`}
                          >
                             {ticket.extraFields.includes(opt.id) ? <Check className="h-4 w-4" /> : opt.icon }
                             {opt.label.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {ticketTypes.length > 1 && (
                    <button onClick={() => removeTicketType(index)} className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Seção 3: Adicionais */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
               <div className="flex items-center gap-3">
                <Utensils className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 italic font-black">Adicionais / Serviços 🍔</h2>
              </div>
              <button
                type="button"
                onClick={addAddon}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus className="h-4 w-4 text-inherit" /> Adicionar Adicional
              </button>
            </div>
            
            <div className="space-y-4">
              {addons.map((addon, index) => (
                <div key={index} className="p-6 border border-gray-100 rounded-xl bg-gray-50/10 space-y-6 relative group hover:border-blue-100 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nome</label>
                      <input
                        type="text"
                        placeholder="Ex: Jantar, Ônibus..."
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 font-bold focus:border-blue-300 outline-none bg-white font-sans"
                        value={addon.name}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].name = e.target.value;
                          setAddons(newAddons);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 font-bold focus:border-blue-300 outline-none bg-white font-sans"
                        value={addon.price}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].price = e.target.value;
                          setAddons(newAddons);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Categoria</label>
                      <select
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 font-bold focus:border-blue-300 outline-none bg-white font-sans"
                        value={addon.category}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].category = e.target.value;
                          setAddons(newAddons);
                        }}
                      >
                        <option value="MEAL">🍽️ Refeição</option>
                        <option value="TRANSPORT">🚌 Transporte</option>
                        <option value="OTHER">✨ Outro</option>
                      </select>
                    </div>
                  </div>
                  {addons.length > 1 && (
                    <button onClick={() => removeAddon(index)} className="absolute top-4 right-4 text-gray-200 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <footer className="flex items-center justify-between p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-50 sticky bottom-8 z-40 animate-in slide-in-from-bottom-4 duration-500">
             <button
              type="button"
              className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-blue-600 transition-all font-sans"
            >
              CRIAR RASCUNHO
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                className="px-8 py-4 rounded-xl border border-gray-100 text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-xl bg-blue-600 text-sm font-black text-white hover:bg-black transition-all shadow-xl shadow-blue-100 flex items-center gap-3 uppercase tracking-widest italic"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin p-0" /> : 'Lançar Evento 🏆'}
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
}
