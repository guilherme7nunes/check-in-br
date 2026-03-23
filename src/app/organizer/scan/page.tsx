'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  ChevronRight, 
  User, 
  Tag, 
  ArrowLeft,
  Loader2,
  Printer
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrganizerScannerPage() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<string>('GENERAL_ENTRANCE');
  const [activities, setActivities] = useState<any[]>([]);
  const [scannedData, setScannedData] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // 1. Simulação: Busca atividades do evento (na real viria da API do evento selecionado)
    setActivities([
      { id: 'GENERAL_ENTRANCE', name: 'Entrada Geral 🏁' },
      { id: 'ADDON:lunch_friday', name: 'Almoço de Sexta 🍱' },
      { id: 'ADDON:dinner_saturday', name: 'Jantar de Gala 🍽️' }
    ]);

    // 2. Inicializar Scanner
    scannerRef.current = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      // Quando um QR é lido, faz o CHECK inicial
      handleCheck(decodedText);
      // Pausar o scanner para mostrar o resultado
      scannerRef.current?.pause();
    };

    scannerRef.current.render(onScanSuccess, (e) => {});

    return () => {
      scannerRef.current?.clear().catch(e => {});
    };
  }, []);

  const handleCheck = async (qrCode: string) => {
    try {
      const resp = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode, activityType: selectedActivity, mode: 'CHECK' })
      });
      const data = await resp.json();
      setScannedData({ qrCode });
      setValidationResult(data);
    } catch (e) {
      alert('Erro na conexão com o servidor 🚫');
    }
  };

  const handleConfirm = async () => {
    if (!scannedData) return;
    setIsConfirming(true);
    try {
      const resp = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          qrCode: scannedData.qrCode, 
          activityType: selectedActivity, 
          mode: 'CONFIRM' 
        })
      });
      const data = await resp.json();
      setValidationResult(data);
      // Reiniciar scanner após um delay para a próxima pessoa
      setTimeout(() => {
        resetScanner();
      }, 2000);
    } catch (e) {
      alert('Houve um erro ao confirmar.');
    } finally {
      setIsConfirming(false);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setValidationResult(null);
    scannerRef.current?.resume();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900 border-t-8 border-slate-900">
      <Navbar />
      
      <main className="max-w-2xl mx-auto py-10 px-4 flex flex-col items-center">
        
        <header className="w-full mb-8 text-center space-y-2">
           <h1 className="text-2xl font-black italic tracking-tight uppercase">Central de Validação 🏷️</h1>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Controle de entrada e consumo</p>
        </header>

        {/* Escolha da Atividade (Passo 1) */}
        {!scannedData && (
          <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">O que você está validando?</label>
            <select 
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-black text-slate-900 outline-none focus:border-slate-900 transition-all text-sm"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
            >
              {activities.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Câmera / Scanner (Passo 2) */}
        {!scannedData && (
          <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 relative">
             <div id="reader" className="w-full"></div>
             <div className="p-4 bg-slate-900 text-white text-center text-[10px] font-black uppercase tracking-[0.2em] italic">Aproxime o QR Code do Crachá</div>
          </div>
        )}

        {/* Resultado e Confirmação (Passo 3 & 4) */}
        {scannedData && validationResult && (
          <div className={`w-full p-10 rounded-[40px] shadow-2xl space-y-8 animate-in zoom-in slide-in-from-bottom-10 duration-500 border-b-8 ${
            validationResult.status === 'VALID' ? 'bg-white border-green-500' : 
            validationResult.status === 'ALREADY_USED' ? 'bg-white border-yellow-500' : 
            'bg-white border-red-500'
          }`}>
             
             <div className="flex flex-col items-center text-center space-y-4">
                {validationResult.status === 'VALID' && (
                   <div className="bg-green-100 p-6 rounded-full text-green-500 animate-bounce">
                     <CheckCircle2 className="h-16 w-16" />
                   </div>
                )}
                {validationResult.status === 'ALREADY_USED' && (
                   <div className="bg-yellow-100 p-6 rounded-full text-yellow-600">
                     <AlertTriangle className="h-16 w-16" />
                   </div>
                )}
                {validationResult.status === 'INVALID' && (
                   <div className="bg-red-100 p-6 rounded-full text-red-500">
                     <XCircle className="h-16 w-16" />
                   </div>
                )}
                {validationResult.status === 'SUCCESS' && (
                   <div className="bg-green-600 p-6 rounded-full text-white animate-pulse">
                     <CheckCircle2 className="h-16 w-16" />
                   </div>
                )}

                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {validationResult.status === 'VALID' ? 'Tudo Certo!' : 
                   validationResult.status === 'ALREADY_USED' ? 'Já Consumido ⚖️' : 
                   validationResult.status === 'SUCCESS' ? 'Validado ✅' : 'Acesso Negado 🚫'}
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">{validationResult.message}</p>
             </div>

             <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400"><User className="h-6 w-6" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participante</p>
                    <p className="font-black text-slate-900 uppercase italic">{validationResult.attendee || 'Desconhecido'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400"><Tag className="h-6 w-6" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atividade</p>
                    <p className="font-black text-slate-900 uppercase italic">{activities.find(a => a.id === selectedActivity)?.name || 'Atividade'}</p>
                  </div>
                </div>
             </div>

             <div className="flex flex-col gap-4">
                {validationResult.status === 'VALID' && (
                   <button 
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="w-full bg-green-500 text-white font-black py-7 rounded-[32px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-green-100 uppercase tracking-widest italic"
                   >
                     {isConfirming ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Confirmar Validação ✅'}
                   </button>
                )}

                {validationResult.status === 'SUCCESS' && selectedActivity === 'GENERAL_ENTRANCE' && (
                  <button 
                    onClick={() => alert('Abrindo impressão de crachá...')}
                    className="w-full bg-slate-900 text-white font-black py-7 rounded-[32px] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 uppercase tracking-widest italic"
                  >
                    <Printer className="h-6 w-6" /> Imprimir Crachá 🪪
                  </button>
                )}

                <button 
                  onClick={resetScanner}
                  className="w-full bg-slate-100 text-slate-400 font-black py-5 rounded-[24px] uppercase tracking-widest text-xs"
                >
                  Continuar Escaneando 🔭
                </button>
             </div>

          </div>
        )}

      </main>

      <style jsx global>{`
        #reader__scan_region video {
            border-radius: 24px !important;
            object-fit: cover !important;
        }
        #reader button {
            background: #0f172a;
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.1em;
            margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
