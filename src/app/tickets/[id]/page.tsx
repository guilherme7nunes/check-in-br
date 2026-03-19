import { prisma } from '@/lib/prisma';
import Navbar from '@/components/navbar';
import QRCode from 'qrcode';
import { Ticket as TicketIcon, Calendar, MapPin, User, CheckCircle, Smartphone } from 'lucide-react';

export default async function TicketPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Mock de busca de ingresso (Na vida real, buscaria no banco)
  const ticket = {
    id: id,
    eventName: "Encontro Nacional Check in Br 2026",
    attendeeName: "João Silva",
    attendeeEmail: "joao@exemplo.com",
    type: "Ingresso Duplo (Participante 1)",
    date: "15 de Outubro, 2026",
    location: "São Paulo, SP",
    addons: ["Jantar Quinta-feira", "Translado Ônibus"]
  };

  // Gerar o QR Code em Base64
  const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({
    ticketId: ticket.id,
    attendee: ticket.attendeeName,
    checkin: false
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-md mx-auto py-12 px-4">
        {/* Card do Ingresso */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100 overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
          
          {/* Cabeçalho do Ingresso */}
          <div className="bg-blue-600 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TicketIcon className="h-24 w-24 rotate-12" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight leading-tight">{ticket.eventName}</h1>
            <p className="text-blue-100 text-sm mt-1">{ticket.type}</p>
          </div>

          <div className="p-8 space-y-8">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <img src={qrCodeDataUrl} alt="QR Code Ingresso" className="h-48 w-48" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Apresente no Check-in</p>
            </div>

            {/* Detalhes do Participante */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Participante</p>
                  <p className="font-bold text-gray-900">{ticket.attendeeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Código do Ingresso</p>
                  <p className="font-mono text-xs text-gray-600">#{ticket.id.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Adicionais Vinculados */}
            {ticket.addons.length > 0 && (
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3" /> Serviços Inclusos:
                </p>
                <ul className="space-y-2">
                  {ticket.addons.map((addon) => (
                    <li key={addon} className="text-xs font-medium text-blue-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {addon}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Rodapé do Ingresso */}
          <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
             <div className="flex justify-between items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
               <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ticket.date}</span>
               <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ticket.location}</span>
             </div>
          </div>
        </div>

        <button 
          onClick={() => window.print()} 
          className="w-full mt-8 bg-white border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          Baixar PDF / Imprimir
        </button>
      </main>
    </div>
  );
}
