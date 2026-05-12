'use client';
import { useState, useEffect } from 'react';
import { CondicionTiroidea } from '@/types';
import Button from '@/components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CONDICIONES: { value: CondicionTiroidea; label: string; desc: string; emoji: string }[] = [
  { value: 'hipotiroidismo', label: 'Hipotiroidismo', desc: 'La tiroides produce menos hormonas de las necesarias', emoji: '🦋' },
  { value: 'hipertiroidismo', label: 'Hipertiroidismo', desc: 'La tiroides está sobreactiva', emoji: '⚡' },
  { value: 'hashimoto', label: 'Hashimoto', desc: 'El sistema inmune ataca la tiroides', emoji: '🛡️' },
  { value: 'sin_diagnostico', label: 'Sin diagnóstico', desc: 'Tengo síntomas pero aún no tengo diagnóstico', emoji: '❓' },
];

const RESTRICCIONES = [
  { value: 'sin_gluten', label: 'Sin gluten' },
  { value: 'sin_lacteos', label: 'Sin lácteos' },
  { value: 'sin_soja', label: 'Sin soja' },
  { value: 'sin_azucar', label: 'Sin azúcar' },
  { value: 'vegetariana', label: 'Vegetariana' },
];

const SINTOMAS = [
  { value: 'cansancio', label: 'Cansancio o fatiga' },
  { value: 'dificultad_bajar_peso', label: 'Dificultad para bajar de peso' },
  { value: 'caida_pelo', label: 'Caída del pelo' },
  { value: 'niebla_mental', label: 'Niebla mental' },
  { value: 'ansiedad', label: 'Ansiedad' },
  { value: 'problemas_sueno', label: 'Problemas de sueño' },
  { value: 'hinchazón', label: 'Hinchazón' },
];

function ProgressBar({ paso }: { paso: number }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i <= paso ? 'bg-brand-naranja' : 'bg-stone-200 dark:bg-stone-700'
          }`}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const [paso, setPaso] = useState(0);
  const [condicion, setCondicion] = useState<CondicionTiroidea | null>(null);
  const [restricciones, setRestricciones] = useState<string[]>([]);
  const [sintomas, setSintomas] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/auth/perfil')
      .then(res => {
        if (!res.ok) { window.location.href = '/login'; return null; }
        return res.json();
      })
      .then(data => {
        if (data?.vio_bienvenida) { window.location.href = '/dashboard'; }
      })
      .catch(() => { window.location.href = '/login'; });
  }, []);

  function toggleItem(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter(x => x !== value) : [...list, value]);
  }

  async function guardar(saltearSintomas = false) {
    await fetch('/api/auth/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        condicion_tiroidea: condicion,
        restricciones,
        sintomas: saltearSintomas ? [] : sintomas,
        vio_bienvenida: true,
      }),
    });
    window.location.href = '/dashboard';
  }

  if (paso === 0) {
    return (
      <div className="min-h-screen bg-brand-verde flex items-center justify-center px-4">
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-8 max-w-md w-full space-y-6 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="text-5xl">🌿</div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Bienvenida a Tiroides Activa
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Recetas pensadas para acompañar tu tratamiento, con ingredientes que respetan tu tiroides.
              Te vamos a hacer un par de preguntas rápidas para personalizar tu experiencia.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong>Importante:</strong> Esta app es un complemento nutricional informativo.
            Siempre seguí las indicaciones de tu médico o nutricionista.
          </div>

          <Button variant="primary" fullWidth size="lg" onClick={() => setPaso(1)}>
            Empezar personalización
          </Button>

          <button
            onClick={() => guardar(true)}
            className="w-full text-center text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors py-1"
          >
            Saltear por ahora
          </button>
        </div>
      </div>
    );
  }

  if (paso === 1) {
    return (
      <div className="min-h-screen bg-brand-crema dark:bg-stone-950 flex items-start justify-center px-4 py-8">
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-6 max-w-md w-full space-y-5 animate-fade-in">
          <ProgressBar paso={0} />

          <div>
            <button
              onClick={() => setPaso(0)}
              className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-3"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Volver
            </button>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              ¿Cuál es tu condición tiroidea?
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              Así personalizamos las recetas para vos
            </p>
          </div>

          <div className="space-y-2">
            {CONDICIONES.map(c => (
              <button
                key={c.value}
                onClick={() => setCondicion(c.value)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all min-h-[64px] flex items-center gap-3 ${
                  condicion === c.value
                    ? 'border-brand-verde bg-green-50 dark:bg-green-950/50 dark:border-emerald-600'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <span className="text-2xl shrink-0">{c.emoji}</span>
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm block">{c.label}</span>
                  <span className="text-stone-500 dark:text-stone-400 text-xs">{c.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Restricciones alimentarias <span className="text-stone-400 font-normal">(opcional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {RESTRICCIONES.map(r => (
                <button
                  key={r.value}
                  onClick={() => toggleItem(restricciones, setRestricciones, r.value)}
                  className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    restricciones.includes(r.value)
                      ? 'bg-brand-naranja text-white border-brand-naranja'
                      : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={!condicion}
            onClick={() => setPaso(2)}
          >
            Continuar →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-crema dark:bg-stone-950 flex items-start justify-center px-4 py-8">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-6 max-w-md w-full space-y-5 animate-fade-in">
        <ProgressBar paso={1} />

        <div>
          <button
            onClick={() => setPaso(1)}
            className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-3"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Volver
          </button>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            ¿Qué síntomas tenés?
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Así personalizamos los mensajes de cada receta
          </p>
        </div>

        <div className="space-y-2">
          {SINTOMAS.map(s => (
            <button
              key={s.value}
              onClick={() => toggleItem(sintomas, setSintomas, s.value)}
              className={`w-full text-left px-4 py-3.5 min-h-[52px] rounded-xl border transition-all text-sm ${
                sintomas.includes(s.value)
                  ? 'border-brand-naranja bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 font-medium'
                  : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <Button variant="primary" fullWidth size="lg" onClick={() => guardar(false)}>
          Empezar a cocinar
        </Button>

        <button
          onClick={() => guardar(true)}
          className="w-full text-center text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors py-1"
        >
          Saltear síntomas
        </button>
      </div>
    </div>
  );
}
