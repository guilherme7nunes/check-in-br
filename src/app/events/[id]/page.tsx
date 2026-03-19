'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Utensils, 
  Bus, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage() {
  // Mock de dados para demonstração do fluxo solicitado
  const event = {
    title: "Encontro Nacional Check in Br 2026",
    date: "15 de Outubro, 2026",
    location: "São Paulo, SP - Centro de Convenções",
    description: "O maior encontro de tecnologia aplicada ao setor de eventos do Brasil. Palestras, networking e experiências gastronômicas inclusivas.",
    image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe5?q=80&w=2070&auto=format&fit=crop",
    tickets: [
      { id: '1', name: 'Ingresso Individual', price: 150.00, isGroup: false },
      { id: '2', name: 'Ingresso em Dupla (Promoção)', price: 250.00, isGroup: true, groupSize: 2 },
    ],
    addons: [
      { id: 'a1', name: 'Jantar Quinta-feira', price: 60.00, category: 'MEAL' },
      { id: 'a2', name: 'Almoço Sexta-feira', price: 45.00, category: 'MEAL' },
      { id: 'a3', name: 'Translado Ônibus (Hoteis Centro)', price: 30.00, category: 'TRANSPORT' },
    ]
  };

  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-12 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Evento Confirmado</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-200">
                  <span className="flex items-center gap-1.5"><Calendar className="h-5 w-5 text-blue-400" /> {event.date}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-5 w-5 text-blue-400" /> {event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Lado Esquerdo: Detalhes */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o evento</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecione seu Ingresso</h2>
            <div className="space-y-4">
              {event.tickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${
                    selectedTicket?.id === ticket.id 
                    ? 'border-blue-600 bg-blue-50/30' 
                    : 'border-gray-100 hover:border-blue-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${selectedTicket?.id === ticket.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {ticket.isGroup ? <Users className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{ticket.name}</h3>
                      <p className="text-sm text-gray-500">{ticket.isGroup ? `Válido para ${ticket.groupSize} pessoas` : 'Entrada individual para o evento'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">R$ {ticket.price.toFixed(2)}</p>
                    {selectedTicket?.id === ticket.id && (
                      <span className="text-blue-600 text-xs font-bold uppercase flex items-center justify-end gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3" /> Selecionado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Compra 100% Segura</h4>
                <p className="text-sm text-gray-600">Pagamento processado via Stripe. Seus dados estão protegidos sob a LGPD.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Resumo Flutuante */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Resumo da Compra</h3>
            </div>
            <div className="p-6 space-y-6">
              {!selectedTicket ? (
                <div className="text-center py-8">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Selecione um ingresso para continuar</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-gray-900">
                    <span className="bg-blue-600/5 text-blue-700 text-xs font-bold px-2 py-1 rounded">1x {selectedTicket.name}</span>
                    <span className="font-bold">R$ {selectedTicket.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-gray-500 text-sm">Total a pagar:</span>
                      <span className="text-3xl font-black text-gray-900">R$ {selectedTicket.price.toFixed(2)}</span>
                    </div>

                    <Link 
                      href={`/checkout?ticket=${selectedTicket.id}`}
                      className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                      Continuar para Inscrição
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    
                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">
                      Próximo passo: Informações e Adicionais
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
