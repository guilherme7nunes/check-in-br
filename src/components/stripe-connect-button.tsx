'use client';

import { useState } from 'react';
import { Loader2, CreditCard, CheckCircle2 } from 'lucide-react';

export function StripeConnectButton({ isConnected }: { isConnected: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 font-medium text-sm">
        <CheckCircle2 className="h-4 w-4" />
        Conta Stripe Vinculada
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-70"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <CreditCard className="h-4 w-4" />
          Configurar Recebimentos (Stripe)
        </>
      )}
    </button>
  );
}
