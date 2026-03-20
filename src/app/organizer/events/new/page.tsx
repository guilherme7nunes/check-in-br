'use client';

import { useState, useRef } from 'react';
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
  UserPlus,
  UploadCloud
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    showTimes: true,
    location: '',
    locationType: 'PHYSICAL',
    image: null as string | null, // Base64 ou URL de preview
    schedule: '',
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: 'Individual', price: '', capacity: '', isGroup: false, groupSize: 1, customFields: [] }
  ]);

  const [addons, setAddons] = useState<Addon[]>([
    { id: '1', name: 'Refeição Executiva', price: '', category: 'REFEIÇÃO' }
  ]);

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito pesada! Máximo 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData({ ...eventData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '', capacity: '', isGroup: false, groupSize: 1, customFields: [] }]);
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
    // LOGICA DE SALVAMENTO PREMIUM
    setTimeout(() => {
      setLoading(false);
      alert('Evento Lançado com Sucesso! 🏁');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24 font-sans text-gray-900 focus-within:scrollbar-thin">
      <Navbar />
      
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Criar Novo Evento</h1>
          <p className="text-gray-400 mt-2 font-medium">Configure sua experiência de forma clean e ágil.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Seção 1: Capa e Título (Design Renovado Clean) */}
          <section className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-10 relative overflow-hidden">
             <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Capa & Detalhes</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Identidade Visual do Evento</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* ÁREA DE UPLOAD PREMIUM */}
                <div className="md:col-span-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 ml-1 italic">Capa do Evento (Upload Direto)</label>
                   <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept="image/*"
                    onChange={handleImageUpload}
                   />
                   
                   {!eventData.image ? (
                     <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-4 border-dashed border-gray-100 rounded-[32px] p-16 text-center hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer group"
                     >
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                           <UploadCloud className="h-10 w-10 text-gray-300" />
                        </div>
                        <p className="text-gray-900 font-black text-lg uppercase italic tracking-widest">Clique para selecionar</p>
                        <p className="text-gray-400 text-xs mt-2 font-medium">Recomendado: 1280x720px (Max 5MB)</p>
                     </div>
                   ) : (
                     <div className="relative w-full aspect-video rounded-[32px] overflow-hidden border-2 border-gray-100 shadow-2xl group">
                        <img src={eventData.image} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                           <button onClick={() => fileInputRef.current?.click()} type="button" className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-black uppercase text-xs hover:bg-blue-600 hover:text-white transition-all">Trocar Imagem</button>
                           <button onClick={() => setEventData({...eventData, image: null})} type="button" className="bg-red-500 text-white p-3 rounded-2xl hover:bg-black transition-all"><X className="h-5 w-5" /></button>
                        </div>
                     </div>
                   )}
                </div>

                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1 italic">Título Oficial</label>
                   <input
                    type="text"
                    required
                    placeholder="Ex: Encontro Nacional da Fé 2026"
                    className="w-full rounded-[24px] border-2 border-gray-50 p-6 text-gray-900 font-black text-xl focus:border-blue-500 outline-none transition-all placeholder:text-gray-200"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  />
                </div>
             </div>
          </section>

          {/* Seção 2: Datas e Horários (Clean) */}
          <section className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
             <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                <Clock className="h-5 w-5 text-gray-900" />
                <h2 className="text-xl font-bold text-gray-900 tracking-tight italic uppercase">Agenda</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Início do Evento</label>
                   <input type="datetime-local" className="w-full rounded-2xl border-2 border-gray-50 p-4 font-black outline-none focus:border-blue-500 shadow-sm" value={eventData.startDate} onChange={(e) => setEventData({...eventData, startDate: e.target.value})} />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Encerramento</label>
                   <input type="datetime-local" className="w-full rounded-2xl border-2 border-gray-50 p-4 font-black outline-none focus:border-blue-500 shadow-sm" value={eventData.endDate} onChange={(e) => setEventData({...eventData, endDate: e.target.value})} />
                </div>
                
                <div className="md:col-span-2">
                   <button 
                    type="button" 
                    onClick={() => setEventData({...eventData, showTimes: !eventData.showTimes})}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      eventData.showTimes ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'
                    }`}
                   >
                     {eventData.showTimes ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                     {eventData.showTimes ? 'Horários: Visíveis ao Público' : 'Horários: Ocultos (Confuso para multidiárias)'}
                   </button>
                </div>
             </div>
          </section>

          {/* Seção 3: Ingressos Dinâmicos (Visual Elite) */}
          <section className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-10">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Tag className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-black text-gray-900 italic uppercase">Cardápio de Ingressos</h2>
                </div>
                <button type="button" onClick={addTicketType} className="bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                  <Plus className="h-4 w-4" /> Novo Tipo
                </button>
             </div>

             <div className="space-y-8">
               {ticketTypes.map((ticket, index) => (
                 <div key={index} className="p-10 border-2 border-gray-50 rounded-[32px] bg-gray-50/20 space-y-8 relative group hover:border-blue-100 transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                       <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Modalidade (Ex: Individual, Duplo)</label>
                          <input type="text" className="w-full rounded-2xl border-2 border-white p-5 text-gray-900 font-black focus:border-blue-500 outline-none bg-white shadow-sm" value={ticket.name} onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].name = e.target.value;
                            setTicketTypes(newTypes);
                          }} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Valor (R$)</label>
                          <input type="number" className="w-full rounded-2xl border-2 border-white p-5 text-gray-900 font-black focus:border-blue-500 outline-none bg-white shadow-sm" value={ticket.price} onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].price = e.target.value;
                            setTicketTypes(newTypes);
                          }} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic text-blue-600">PAX / Ocupantes</label>
                          <input type="number" className="w-full rounded-2xl border-2 border-blue-100 p-5 text-gray-900 font-black focus:border-blue-500 outline-none bg-white shadow-sm" value={ticket.groupSize} onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].groupSize = parseInt(e.target.value) || 1;
                            setTicketTypes(newTypes);
                          }} />
                       </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
                       <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Informações Mínimas (P1, P2...)</p>
                          <button type="button" onClick={() => addCustomField(index)} className="text-[10px] font-black text-blue-600 hover:text-black transition-all uppercase tracking-widest flex items-center gap-1">
                             <PlusCircle className="h-3 w-3" /> Acrescentar Dado Extra
                          </button>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          <span className="px-4 py-2 bg-gray-50 text-gray-300 text-[9px] font-black rounded-xl uppercase tracking-widest border border-gray-100">Nome</span>
                          <span className="px-4 py-2 bg-gray-50 text-gray-300 text-[9px] font-black rounded-xl uppercase tracking-widest border border-gray-100 italic">Email (Só P1)</span>
                          {ticket.customFields.map((f, fi) => (
                            <div key={fi} className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black rounded-xl uppercase tracking-widest flex items-center gap-2 animate-in zoom-in group">
                               {f.label}
                               <button onClick={() => removeCustomField(index, fi)} className="text-blue-200 hover:text-white"><X className="h-3 w-3" /></button>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </section>

          <footer className="pt-10">
             <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-7 rounded-[32px] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl shadow-blue-100 uppercase tracking-[0.2em] italic text-sm"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Lançar Experiência Premium 🚀'}
            </button>
          </footer>
        </form>
      </main>
      
      <style jsx global>{`
        input::-webkit-calendar-picker-indicator {
          background-position: center;
          background-size: contain;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
