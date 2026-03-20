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
  Loader2
} from 'lucide-react';

export default function NewEventPage() {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
    schedule: '',
  });

  const [ticketTypes, setTicketTypes] = useState([
    { name: 'Individual', price: '', capacity: '', isGroup: false, groupSize: 1 }
  ]);

  const [addons, setAddons] = useState([
    { name: '', price: '', category: 'MEAL' }
  ]);

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
      alert('Evento criado com sucesso (Simulado)!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Evento</h1>
          <p className="text-gray-600 mt-1">Configure os ingressos, refeições e translados do seu evento.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sessão 1: Informações Básicas */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Informações Gerais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Encontro Nacional de Tecnologia"
                  className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Data e Hora
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Localização
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cidade, UF ou Local Específico"
                  className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  rows={4}
                  placeholder="Descreva seu evento de forma geral..."
                  className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium font-sans"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Capa do Evento</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase font-black">Proporção 16:9 (1920x1080)</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cole aqui o link da imagem (URL)"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                    value={eventData.image}
                    onChange={(e) => setEventData({ ...eventData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                   📅 Programação Completa
                 </label>
                 <textarea
                   rows={6}
                   placeholder="Liste os horários, palestras e atividades. Isso aparecerá em um botão especial para o usuário."
                   className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium font-mono text-xs leading-relaxed"
                   value={eventData.schedule}
                   onChange={(e) => setEventData({ ...eventData, schedule: e.target.value })}
                 />
              </div>
            </div>
          </section>

          {/* Sessão 2: Tipos de Ingresso */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Ingressos
              </h2>
              <button
                type="button"
                onClick={addTicketType}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Adicionar Tipo
              </button>
            </div>
            
            <div className="space-y-4">
              {ticketTypes.map((ticket, index) => (
                <div key={index} className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 space-y-4 relative animate-in fade-in slide-in-from-right-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nome do Ingresso</label>
                      <input
                        type="text"
                        placeholder="Ex: Individual, Duplo, VIP"
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm outline-none"
                        value={ticket.name}
                        onChange={(e) => {
                          const newTypes = [...ticketTypes];
                          newTypes[index].name = e.target.value;
                          setTicketTypes(newTypes);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        placeholder="0,00"
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm outline-none"
                        value={ticket.price}
                        onChange={(e) => {
                          const newTypes = [...ticketTypes];
                          newTypes[index].price = e.target.value;
                          setTicketTypes(newTypes);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={ticket.isGroup}
                          onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].isGroup = e.target.checked;
                            if (!e.target.checked) newTypes[index].groupSize = 1;
                            setTicketTypes(newTypes);
                          }}
                        />
                        <span className="text-sm text-gray-700">Ingresso em Grupo?</span>
                      </label>
                      {ticket.isGroup && (
                        <input
                          type="number"
                          placeholder="Pessoas"
                          className="w-16 rounded-lg border border-gray-200 p-2 text-sm outline-none text-gray-900 font-medium"
                          value={ticket.groupSize}
                          onChange={(e) => {
                            const newTypes = [...ticketTypes];
                            newTypes[index].groupSize = parseInt(e.target.value) || 1;
                            setTicketTypes(newTypes);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Sessão 3: Adicionais (Refeições/Transporte) */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-blue-600" />
                Adicionais (Refeições e Transporte)
              </h2>
              <button
                type="button"
                onClick={addAddon}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Adicionar Serviço
              </button>
            </div>
            
            <div className="space-y-4">
              {addons.map((addon, index) => (
                <div key={index} className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 space-y-4 relative animate-in fade-in slide-in-from-right-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nome do Adicional</label>
                      <input
                        type="text"
                        placeholder="Ex: Jantar Quinta, Ônibus Hotel A"
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm outline-none"
                        value={addon.name}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].name = e.target.value;
                          setAddons(newAddons);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        placeholder="0,00"
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm outline-none"
                        value={addon.price}
                        onChange={(e) => {
                          const newAddons = [...addons];
                          newAddons[index].price = e.target.value;
                          setAddons(newAddons);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Categoria</label>
                      <select
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm outline-none bg-white text-gray-900 font-medium"
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
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <footer className="flex justify-end gap-4 shadow-xl shadow-blue-50 p-4 bg-white rounded-2xl border border-gray-100 sticky bottom-4 z-40">
            <button
              type="button"
              className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Salvar Evento
                </>
              )}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
