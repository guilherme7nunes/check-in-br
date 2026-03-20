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
  Utensils, 
  Bus, 
  Users,
  Save,
  Loader2,
  Upload,
  X,
  Globe,
  Clock,
  Eye,
  EyeOff,
  HelpCircle
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
    { name: 'Individual', price: '', capacity: '', isGroup: false, groupSize: 1 }
  ]);

  const [addons, setAddons] = useState([
    { name: '', price: '', category: 'MEAL' }
  ]);

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
    setTicketTypes([...ticketTypes, { name: '', price: '', capacity: '', isGroup: false, groupSize: 1 }]);
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
    // Lógica de salvamento viria aqui integrando com a API
    setTimeout(() => {
      setLoading(false);
      alert('Evento real criado com datas precisas e local configurado!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Novo Encontro Nacional 🏁</h1>
            <p className="text-gray-500 font-medium italic">Configure agora cada detalhe do seu evento de elite.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Sessão 1: Informações Básicas e Capa */}
          <section className="bg-white p-8 sm:p-12 rounded-[40px] shadow-sm border border-gray-100 space-y-10 animate-in fade-in duration-500">
            <div className="flex items-center justify-between pb-6 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2.5 rounded-2xl"><CheckCircle2 className="h-6 w-6 text-white" /></div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">Informações Gerais</h2>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  type="button"
                  onClick={() => setEventData({ ...eventData, showTimes: !eventData.showTimes })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    eventData.showTimes ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                 >
                   {eventData.showTimes ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                   Exibir Horários: {eventData.showTimes ? 'ATIVADO' : 'OCULTO'}
                 </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload da Imagem */}
              <div className="md:col-span-2">
                 <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Capa do Evento (16:9)</label>
                 <div className={`relative h-72 w-full rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden group ${
                   eventData.image ? 'border-blue-500 bg-blue-50/20' : 'border-gray-100 bg-gray-50 hover:border-blue-200'
                 }`}>
                   {eventData.image ? (
                     <>
                       <img src={eventData.image} alt="Cover Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                         <label className="bg-white text-blue-600 px-6 py-3 rounded-full font-black text-xs cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
                           <Upload className="h-4 w-4" /> Alterar Imagem
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                         </label>
                         <button 
                           onClick={() => setEventData({ ...eventData, image: '' })}
                           className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-xl"
                         >
                           <X className="h-5 w-5" />
                         </button>
                       </div>
                     </>
                   ) : (
                     <label className="cursor-pointer flex flex-col items-center gap-4 py-12 px-8 text-center group">
                        <div className="bg-white p-6 rounded-[28px] shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform">
                          <ImageIcon className="h-10 w-10 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-900 font-black text-xl italic tracking-tight">Clique para subir a capa</p>
                          <p className="text-gray-400 font-medium text-[10px] uppercase tracking-[0.2em]">JPG • PNG • 1920x1080px</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     </label>
                   )}
                 </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Título do Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Encontro Nacional de Tecnologia"
                  className="w-full rounded-2xl border-2 border-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 outline-none transition-all font-black text-xl italic bg-white"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                />
              </div>

              {/* Datas Início e Fim */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-blue-500" /> Início do Evento
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full rounded-2xl border-2 border-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-0 outline-none font-bold bg-white"
                  value={eventData.startDate}
                  onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-red-500" /> Término do Evento
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full rounded-2xl border-2 border-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-0 outline-none font-bold bg-white"
                  value={eventData.endDate}
                  onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                />
              </div>

              {/* Localização Dinâmica */}
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" /> Tipo e Local do Evento
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'PHYSICAL', label: 'Físico', icon: <MapPin className="h-4 w-4" /> },
                    { id: 'ONLINE', label: 'Online', icon: <Globe className="h-4 w-4" /> },
                    { id: 'TO_DEFINE', label: 'A Definir', icon: <HelpCircle className="h-4 w-4" /> }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setEventData({ ...eventData, locationType: type.id })}
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all border-2 ${
                        eventData.locationType === type.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
                        : 'bg-white border-gray-50 text-gray-400 hover:border-gray-100'
                      }`}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
                
                {eventData.locationType !== 'TO_DEFINE' && (
                  <input
                    type="text"
                    required
                    placeholder={eventData.locationType === 'PHYSICAL' ? "Cidade, UF ou Local Específico" : "Link da Sala Online (Zoom, YouTube, etc.)"}
                    className="w-full rounded-2xl border-2 border-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 outline-none font-bold bg-white animate-in slide-in-from-top-2 duration-300"
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">📝 Descrição Principal</label>
                <textarea
                  rows={4}
                  placeholder="Conte um pouco sobre o evento..."
                  className="w-full rounded-2xl border-2 border-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 outline-none font-medium leading-relaxed bg-white"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2 font-mono flex items-center gap-2 italic">
                  📜 Programação do Evento (Schedule)
                </label>
                <textarea
                  rows={6}
                  placeholder="9:00 - Abertura\n10:30 - Coffee Break\n..."
                  className="w-full rounded-2xl border-2 border-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 outline-none font-mono text-sm leading-relaxed bg-white"
                  value={eventData.schedule}
                  onChange={(e) => setEventData({ ...eventData, schedule: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Sessão 2: Tipos de Ingresso */}
          <section className="bg-white p-8 sm:p-12 rounded-[40px] shadow-sm border border-gray-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2.5 rounded-2xl"><Users className="h-6 w-6 text-white" /></div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">Ingressos 🔥</h2>
              </div>
              <button
                type="button"
                onClick={addTicketType}
                className="bg-blue-50 text-blue-600 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus className="h-4 w-4 text-inherit" /> Adicionar Tipo
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {ticketTypes.map((ticket, index) => (
                <div key={index} className="p-8 border-2 border-gray-50 rounded-[32px] bg-white space-y-6 relative hover:border-blue-100 transition-all group">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Ingresso</label>
                      <input
                        type="text"
                        placeholder="Ex: Individual, Duplo, VIP"
                        className="w-full rounded-xl border border-gray-100 p-3 text-sm text-gray-900 font-bold outline-none focus:border-blue-300"
                        value={ticket.name}
                        onChange={(e) => {
                          const newTypes = [...ticketTypes];
                          newTypes[index].name = e.target.value;
                          setTicketTypes(newTypes);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Preço (R$)</label>
                      <input
                        type="number"
                        placeholder="0,00"
                        className="w-full rounded-xl border border-gray-100 p-3 text-sm text-gray-900 font-bold outline-none focus:border-blue-300"
                        value={ticket.price}
                        onChange={(e) => {
                          const newTypes = [...ticketTypes];
                          newTypes[index].price = e.target.value;
                          setTicketTypes(newTypes);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-6 pt-6">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="h-6 w-6 rounded-lg border-2 border-gray-100 text-blue-600 focus:ring-0"
                          checked={ticket.isGroup}
                          onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].isGroup = e.target.checked;
                            if (!e.target.checked) newTypes[index].groupSize = 1;
                            setTicketTypes(newTypes);
                          }}
                        />
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Grupo?</span>
                      </label>
                      {ticket.isGroup && (
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-gray-400">Pessoas:</span>
                           <input
                            type="number"
                            className="w-16 rounded-lg border border-gray-100 p-2 text-xs text-gray-900 font-bold outline-none"
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
                  {ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="absolute top-6 right-6 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Sessão 3: Adicionais (Refeições/Transporte) */}
          <section className="bg-white p-8 sm:p-12 rounded-[40px] shadow-sm border border-gray-100 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50">
               <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2.5 rounded-2xl"><Utensils className="h-6 w-6 text-white" /></div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">Extras / Adicionais 🍔</h2>
              </div>
              <button
                type="button"
                onClick={addAddon}
                className="bg-blue-50 text-blue-600 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus className="h-4 w-4 text-inherit" /> Adicionar Serviço
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {addons.map((addon, index) => (
                <div key={index} className="p-8 border-2 border-gray-50 rounded-[32px] bg-white space-y-6 relative hover:border-blue-100 transition-all group">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Adicional</label>
                      <input
                        type="text"
                        placeholder="Ex: Jantar Quinta, Ônibus Hotel A"
                        className="w-full rounded-xl border border-gray-100 p-3 text-sm text-gray-900 font-bold outline-none focus:border-blue-300"
                        value={addon.name}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].name = e.target.value;
                          setAddons(newAddons);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Preço (R$)</label>
                      <input
                        type="number"
                        placeholder="0,00"
                        className="w-full rounded-xl border border-gray-100 p-3 text-sm text-gray-900 font-bold outline-none focus:border-blue-300"
                        value={addon.price}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].price = e.target.value;
                          setAddons(newAddons);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Categoria</label>
                      <select
                        className="w-full rounded-xl border border-gray-100 p-3 text-sm text-gray-900 font-bold outline-none bg-white focus:border-blue-300"
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
                    <button
                      type="button"
                      onClick={() => removeAddon(index)}
                      className="absolute top-6 right-6 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <footer className="flex justify-end gap-5 shadow-2xl shadow-blue-100 p-8 bg-white/90 backdrop-blur-2xl rounded-[40px] border border-gray-50 sticky bottom-8 z-40 animate-in slide-in-from-bottom-4 duration-500">
            <button
              type="button"
              className="px-12 py-6 rounded-2xl border-2 border-gray-100 text-sm font-black text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-widest italic"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-16 py-6 rounded-2xl bg-blue-600 text-sm font-black text-white hover:bg-black transition-all shadow-2xl shadow-blue-200 flex items-center gap-4 uppercase tracking-widest italic"
            >
              {loading ? (
                <Loader2 className="h-7 w-7 animate-spin px-0" />
              ) : (
                <>
                  <Save className="h-6 w-6" />
                  Lançar Agora 🏁
                </>
              )}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
