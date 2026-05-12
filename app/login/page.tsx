'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError('Completá email y contraseña');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al ingresar');
        return;
      }

      if (!data.usuario.vio_bienvenida) {
        window.location.href = '/onboarding';
      } else {
        window.location.href = '/dashboard';
      }

    } catch {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1B4332] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif font-bold text-white text-4xl mb-2">Tiroides Activa</h1>
          <p className="text-emerald-200 text-sm">Tu alimentación organizada para la tiroides</p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-2xl">
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">
            Bienvenida 👋
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
            Ingresá con tus datos de acceso
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={cargando}
            className="w-full bg-[#F97316] hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-base shadow-md shadow-orange-200"
          >
            {cargando ? 'Ingresando...' : 'Ingresar →'}
          </button>

          <p className="text-center text-xs text-stone-400 mt-4">
            ¿Olvidaste tu contraseña?{' '}
            <a href="/reset-password" className="text-[#1B4332] dark:text-emerald-400 hover:underline">
              Recuperala acá
            </a>
          </p>
        </div>

        <p className="text-center text-emerald-300/70 text-xs mt-6 leading-relaxed px-4">
          La información de esta app es educativa y no reemplaza la consulta con tu médico.
        </p>
      </div>
    </div>
  );
}
