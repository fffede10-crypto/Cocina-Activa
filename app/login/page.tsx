'use client';
import { useEffect } from 'react';
import { loginDemo, isLogueado } from '@/lib/auth-local';

export default function LoginPage() {
  useEffect(() => {
    if (isLogueado()) {
      window.location.href = '/dashboard';
    }
  }, []);

  function handleDemo() {
    loginDemo();
    window.location.href = '/dashboard';
  }

  return (
    <div className="min-h-screen bg-brand-verde flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌿</div>
          <h1 className="font-serif text-4xl font-bold text-white leading-tight">
            Cocina Activa
          </h1>
          <p className="text-green-300 mt-1 text-sm tracking-wide">para Tiroides</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              Bienvenida
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Recetas pensadas para tu tiroides
            </p>
          </div>

          <button
            onClick={handleDemo}
            className="w-full bg-brand-naranja hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-base px-6 py-3.5 rounded-xl shadow-lg shadow-orange-200 dark:shadow-orange-900/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Entrar con cuenta demo
          </button>

          <div className="space-y-2 text-center">
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Demo: María · Hashimoto · sin gluten y lácteos
            </p>
            <button className="text-xs text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400 transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <p className="text-center text-green-300/70 text-xs mt-6 leading-relaxed px-4">
          La información de esta app es educativa y no reemplaza la consulta con tu médico.
        </p>
      </div>
    </div>
  );
}
