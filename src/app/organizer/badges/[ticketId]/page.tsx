import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { notFound } from 'next/navigation';

export default async function BadgeViewPage({ params }: { params: { ticketId: string } }) {
  const { ticketId } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      ticketType: {
        include: { event: true }
      }
    }
  });

  if (!ticket || !ticket.qrCode) {
    return notFound();
  }

  // Gerar QR Code para impressão
  const qrImageUrl = await QRCode.toDataURL(ticket.qrCode, {
    width: 600,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0 print:p-0">
      
      {/* Container do Crachá (Padrão 10x15cm vertical) */}
      <div className="w-[105mm] h-[150mm] bg-white border border-slate-100 shadow-2xl rounded-3xl relative overflow-hidden flex flex-col items-center justify-between p-10 print:shadow-none print:border-none print:w-full print:h-screen print:rounded-none">
        
        {/* Topo / Marcação de Categoria */}
        <div className="absolute top-0 inset-x-0 h-16 bg-slate-900 flex items-center justify-center">
           <h3 className="text-white font-black uppercase tracking-[0.3em] text-[10px] italic">Organizador / {ticket.ticketType.event.title}</h3>
        </div>

        {/* Nome do Participante (Em destaque) */}
        <div className="mt-20 text-center space-y-2">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Participante Oficial</p>
           <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none break-words max-w-[250px]">
             {ticket.attendeeName}
           </h1>
        </div>

        {/* QR Code Mestre */}
        <div className="relative group">
           <div className="bg-slate-50 p-6 rounded-[40px] border-2 border-slate-100 mb-4 transform hover:scale-105 transition-transform">
             <img src={qrImageUrl} alt="Master QR Code" className="w-[200px] h-auto" />
           </div>
           <p className="text-center text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-20">ID: {ticket.qrCode.slice(0, 8)}</p>
        </div>

        {/* Rodapé do Evento */}
        <div className="w-full border-t border-slate-100 pt-6 text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Encontro Nacional 🏁 2026</p>
           <p className="text-[10px] font-black text-slate-900 uppercase italic mt-1">{ticket.ticketType.name}</p>
        </div>

        {/* Overlay Invisível para Trigger de Impressão */}
        <div className="print:hidden absolute bottom-4 text-[10px] font-bold text-blue-500 animate-pulse uppercase tracking-widest">
           Pressione Ctrl + P para imprimir 🖨️
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          @page {
            size: 105mm 150mm;
            margin: 0;
          }
        }
      ` }} />
    </div>
  );
}
