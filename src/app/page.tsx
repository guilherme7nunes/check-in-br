'use client';

import Navbar from "@/components/navbar";
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Users, 
  Smartphone, 
  ShieldCheck, 
  TrendingUp,
  ChevronRight,
  Ticket
} from "lucide-react";
import Link from "next/link";
import { Suspense } from 'react';

export default function Home() {
  const featuredEvents = [
    {
      id: '1',
      title: "Encontro Nacional Check in Br 2026",
      date: "15 de Outubro, 2026",
      location: "São Paulo, SP",
      price: "150.00",
      image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe5?q=80&w=2070&auto=format&fit=crop",
      category: "Tecnologia"
    },
    {
      id: '2',
      title: "Summit de Liderança Executiva",
      date: "22 de Novembro, 2026",
      location: "Rio de Janeiro, RJ",
      price: "290.00",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
      category: "Negócios"
    },
    {
      id: '3',
      title: "Workshop de Gastronomia Inclusiva",
      date: "05 de Dezembro, 2026",
      location: "Belo Horizonte, MG",
      price: "95.00",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop",
      category: "Gastronomia"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <Suspense fallback={<div className="p-20 text-center">Carregando portal...</div>}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-blue-50/50 rounded-bl-[100px] hidden lg:block"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Plataforma de Eventos nº 1 do Brasil
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-gray-900">
                Sua experiência de <span className="text-blue-600">Check-in</span> começa aqui.
              </h1>
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                Organize, venda e gerencie seus eventos com a plataforma mais moderna e intuitiva do mercado. Rapidez no acesso e segurança total no pagamento.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2 group">
                  Criar meu Evento
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#eventos" className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:border-blue-200 transition-all flex items-center gap-2">
                  Ver Eventos
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-8 text-gray-400">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium"><span className="text-gray-900 font-bold">+5.000</span> organizadores já confiam na Check in Br</p>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-200 border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" 
                  alt="App interface" 
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-4 animate-bounce duration-[3000ms]">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Vendas Hoje</p>
                  <p className="text-lg font-black text-gray-900">R$ 12.450,00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Por que escolher o Check in Br?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto italic">Tecnologia de ponta para quem organiza e para quem participa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Smartphone className="h-8 w-8 text-blue-600" />, title: "Check-in Mobile", desc: "Acesso rápido via QR Code direto pelo celular dos participantes." },
              { icon: <ShieldCheck className="h-8 w-8 text-blue-600" />, title: "Pagamento Seguro", desc: "Integração total com Stripe para recebimentos no cartão ou PIX." },
              { icon: <Users className="h-8 w-8 text-blue-600" />, title: "Gestão de Equipe", desc: "Painel administrativo para controle de convidados e acessos." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section id="eventos" className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Próximos Grandes Eventos</h2>
              <p className="text-gray-500">Explore o que está acontecendo perto de você</p>
            </div>
            <Link href="/login" className="text-blue-600 font-bold flex items-center gap-1 group">
              Ver todos os eventos em destaque
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group">
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-white/20">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {event.location}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-gray-400">R$</span>
                        <span className="text-2xl font-black text-gray-900">{event.price}</span>
                      </div>
                      <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-32">
        <div className="bg-gray-900 rounded-[40px] p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] group-hover:bg-blue-600/30 transition-all duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 blur-[80px]"></div>
          
          <div className="max-w-3xl space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Pronto para elevar o nível do seu próximo evento?
            </h2>
            <p className="text-gray-400 text-lg md:text-xl">
              Crie sua conta agora mesmo e comece a vender seus ingressos em menos de 5 minutos. Sem taxas ocultas, sem complicação.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl shadow-white/5 flex items-center gap-2">
                Começar Gratuitamente
                <Ticket className="h-5 w-5" />
              </Link>
              <Link href="/login" className="text-white border-2 border-white/10 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all">
                Falar com consultor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4">
             <div className="bg-blue-600 p-2 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900">Check in Br</span>
              <p className="text-gray-400 text-sm">© 2026 Check in Br Plataforma de Eventos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      </Suspense>
    </div>
  );
}
