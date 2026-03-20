'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Phone,
  Ticket,
  Calendar,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-50">Carregando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('from') || '/dashboard';
  
  const [role, setRole] = useState<'BUYER' | 'ORGANIZER' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Por favor, selecione seu tipo de perfil.');
      return;
    }
    if (!acceptedTerms) {
      setError('Você precisa aceitar os termos da LGPD.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role,
          acceptedTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao criar conta.');
      }

      setSuccess(true);
      // Auto-redirect to Login
      setTimeout(() => {
        router.push(`/login?from=${encodeURIComponent(callbackUrl)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-2xl text-center space-y-6 animate-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Conta criada!</h2>
            <p className="text-gray-500 font-medium tracking-tight leading-relaxed">Sua conta foi criada com sucesso. Redirecionando para você entrar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado Esquerdo - Info (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-20"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white group">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Check in Br</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-12">
          <h2 className="text-6xl font-black text-white leading-tight tracking-tight">
            Seja bem-vindo ao futuro dos eventos.
          </h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/10 p-2 rounded-lg"><ShieldCheck className="h-5 w-5" /></div>
              <p className="font-semibold text-white/90">Segurança total com padrão bancário</p>
            </div>
            <div className="flex items-center gap-4 text-white">
               <div className="bg-white/10 p-2 rounded-lg"><CheckCircle className="h-5 w-5" /></div>
               <p className="font-semibold text-white/90">Check-in digital em milissegundos</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex -space-x-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-12 h-12 rounded-full border-4 border-blue-600 bg-gray-200 overflow-hidden shadow-xl shadow-blue-900/10 transition-transform hover:-translate-y-1 cursor-pointer">
              <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
            </div>
          ))}
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 bg-blue-400 flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
            +5k
          </div>
        </div>
      </div>

      {/* Lado Direito - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-20 overflow-y-auto">
        <div className="w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
           <div className="space-y-3">
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl"><Calendar className="h-5 w-5 text-white" /></div>
              <span className="text-xl font-bold text-gray-900 tracking-tighter">Check in Br</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Criar minha conta 🏁</h1>
            <p className="text-gray-500 font-medium">Cadastre-se para aproveitar eventos incríveis ou organizá-los.</p>
          </div>

          {!role ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Seu Perfil Principal</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setRole('BUYER')}
                    className="p-8 rounded-[32px] border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/20 group transition-all text-left space-y-4"
                  >
                    <div className="bg-gray-100 p-3 rounded-2xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Ticket className="h-8 w-8 text-gray-500 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Participante</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">Quero comprar ingressos, cursos e palestras.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setRole('ORGANIZER')}
                    className="p-8 rounded-[32px] border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/20 group transition-all text-left space-y-4"
                  >
                    <div className="bg-gray-100 p-3 rounded-2xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Calendar className="h-8 w-8 text-gray-500 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Organizador</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">Quero vender e gerenciar eventos de tecnologia.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setRole(null)} className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors">
                  ← Mudar perfil para {role === 'BUYER' ? 'Organizador' : 'Participante'}
                </button>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg">
                  Perfil: {role === 'BUYER' ? 'Comprador' : 'Organizador'}
                </span>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-in shake duration-500">
                  <AlertCircle className="h-4 w-4" />
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-inherit" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-2xl border-2 border-gray-100 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium sm:text-sm"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-inherit" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-2xl border-2 border-gray-100 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium sm:text-sm"
                    placeholder="Seu melhor email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-inherit" />
                  </div>
                  <input
                    name="phone"
                    type="text"
                    required
                    className="block w-full rounded-2xl border-2 border-gray-100 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium sm:text-sm"
                    placeholder="Seu WhatsApp (ddd) 99999..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none group-focus-within:text-blue-600 transition-colors">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-inherit" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-2xl border-2 border-gray-100 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium sm:text-sm"
                    placeholder="Sua senha secreta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 rounded-lg border-2 border-gray-200 text-blue-600 focus:ring-0 cursor-pointer"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-500 font-medium leading-[1.6]">
                    Aceito os <a href="#" className="font-extrabold text-blue-600 hover:underline">termos de uso</a> e a{' '}
                    <a href="#" className="font-extrabold text-blue-600 hover:underline">política de privacidade</a> conforme a LGPD brasileira.
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-[20px] bg-blue-600 py-4 px-4 text-lg font-black text-white hover:bg-blue-700 transition-all disabled:opacity-70 shadow-xl shadow-blue-200"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      Concluir Cadastro
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm font-bold text-gray-500">
                  Já faz parte da elite?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 underline transition-colors">
                    Fazer Login agora
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
