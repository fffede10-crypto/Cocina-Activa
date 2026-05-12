'use client';
import { useEffect, useState } from 'react';
import { getAlimentosPorCategoria } from '@/lib/recetas';
import { Alimento, PerfilUsuario } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type Tab = 'verde' | 'amarillo' | 'rojo' | 'intestino';

const tabs = [
  {
    value: 'verde' as Tab,
    label: 'Beneficiosos',
    emoji: '🟢',
    desc: 'Favorecen tu función tiroidea',
    activeColor: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
    inactiveColor: 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300',
  },
  {
    value: 'amarillo' as Tab,
    label: 'Con moderación',
    emoji: '🟡',
    desc: 'Ojo con las cantidades',
    activeColor: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300',
    inactiveColor: 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300',
  },
  {
    value: 'rojo' as Tab,
    label: 'Evitar',
    emoji: '🔴',
    desc: 'Pueden interferir con la tiroides',
    activeColor: 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300',
    inactiveColor: 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300',
  },
  {
    value: 'intestino' as Tab,
    label: 'Intestino',
    emoji: '🦠',
    desc: 'Intestino & tiroides: la conexión clave',
    activeColor: 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
    inactiveColor: 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300',
  },
];

const borderLeft: Record<string, string> = {
  verde:     'border-l-4 border-l-emerald-500',
  amarillo:  'border-l-4 border-l-yellow-400',
  rojo:      'border-l-4 border-l-red-500',
  intestino: 'border-l-4 border-l-teal-500',
};

const PROBIOTICOS_IDS = [56, 57, 58, 59, 60];

const EVITAR_INTESTINO = [
  { nombre: 'Trigo y gluten', razon: 'Aumenta la permeabilidad intestinal — especialmente problemático en Hashimoto.' },
  { nombre: 'Harina refinada', razon: 'Sin fibra ni nutrientes, alimenta bacterias nocivas y genera inflamación intestinal.' },
  { nombre: 'Maíz (en exceso)', razon: 'Alto índice glucémico, puede irritar el intestino sensible.' },
  { nombre: 'Azúcar refinada', razon: 'Alimenta el crecimiento de levaduras y bacterias patógenas en el intestino.' },
  { nombre: 'Alcohol', razon: 'Daña directamente la mucosa intestinal y altera la microbiota.' },
];

export default function GuiaAlimentosPage() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [tab, setTab] = useState<Tab>('verde');
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [probioticos, setProbioticos] = useState<Alimento[]>([]);
  const [filtrarPorCondicion, setFiltrarPorCondicion] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('/api/auth/perfil')
      .then(res => {
        if (!res.ok) { window.location.href = '/login'; return null; }
        return res.json();
      })
      .then(data => { if (data) setPerfil(data); })
      .catch(() => { window.location.href = '/login'; });
  }, []);

  useEffect(() => {
    if (!perfil) return;
    if (tab === 'intestino') {
      const todos = getAlimentosPorCategoria('verde', null);
      setProbioticos(todos.filter(a => PROBIOTICOS_IDS.includes(a.id)));
      return;
    }
    const condicion = filtrarPorCondicion ? perfil.condicion_tiroidea : null;
    setAlimentos(getAlimentosPorCategoria(tab as 'verde' | 'amarillo' | 'rojo', condicion));
  }, [tab, perfil, filtrarPorCondicion]);

  if (!perfil) return null;

  const tieneCondicion = !!perfil.condicion_tiroidea && perfil.condicion_tiroidea !== 'sin_diagnostico';
  const activeTab = tabs.find(t => t.value === tab)!;

  const filtrados = busqueda
    ? alimentos.filter(a => a.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : alimentos;

  function condicionBadge(a: Alimento) {
    if (perfil!.condicion_tiroidea === 'hashimoto' && !a.apta_hashimoto)
      return 'Revisar en Hashimoto 🔷';
    if (perfil!.condicion_tiroidea === 'hipertiroidismo' && !a.apta_hiper)
      return 'Con cuidado en Hipertiroidismo 🔶';
    if (perfil!.condicion_tiroidea === 'hipotiroidismo' && !a.apta_hipo)
      return 'Con cuidado en Hipotiroidismo 🔵';
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
          Guía de alimentos
        </h1>

        {/* Tabs — scroll horizontal en mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => { setTab(t.value); setBusqueda(''); }}
              className={`shrink-0 py-2.5 px-3 rounded-xl text-xs font-medium border-2 transition-all min-h-[60px] min-w-[80px] ${
                tab === t.value ? t.activeColor : t.inactiveColor
              }`}
            >
              <span className="block text-lg leading-none">{t.emoji}</span>
              <span className="block mt-1 leading-tight">{t.label}</span>
            </button>
          ))}
        </div>

        {/* TAB: INTESTINO */}
        {tab === 'intestino' && (
          <div className="space-y-4">
            {/* Card concepto */}
            <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl p-5">
              <h2 className="font-serif text-lg font-bold text-teal-900 dark:text-teal-200 mb-2">
                ¿Por qué el intestino importa tanto en el hipotiroidismo?
              </h2>
              <p className="text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
                Cuando tenés hipotiroidismo o Hashimoto, la permeabilidad intestinal
                (lo que se conoce como "intestino permeable") puede estar aumentada.
                Esto significa que sustancias que no deberían pasar al torrente sanguíneo,
                lo hacen — generando inflamación que impacta directamente en la tiroides.
              </p>
              <p className="text-sm text-teal-800 dark:text-teal-300 leading-relaxed mt-2">
                Cuidar tu intestino con alimentos probióticos y evitar lo que lo irrita
                (trigo, harina, maíz, azúcar) es una de las estrategias más importantes
                para acompañar tu tratamiento y sentirte cada vez mejor.
              </p>
            </div>

            {/* Probióticos */}
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm mb-2 flex items-center gap-2">
                <span>🦠</span> Probióticos naturales recomendados
              </h3>
              <div className="space-y-3">
                {probioticos.map(a => (
                  <div key={a.id} className={`bg-white dark:bg-stone-900 rounded-2xl p-4 ${borderLeft.intestino} shadow-sm`}>
                    <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{a.nombre}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">{a.descripcion}</p>
                    <p className="text-xs text-teal-700 dark:text-teal-400 mt-1.5 leading-relaxed font-medium">{a.razon_tiroides}</p>
                    {a.reemplazo_sugerido && (
                      <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-3 py-2">
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Tip →</span>
                        <span className="text-xs text-emerald-700 dark:text-emerald-300">{a.reemplazo_sugerido}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Qué evitar */}
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm mb-2 flex items-center gap-2">
                <span>🚫</span> Qué evitar para proteger tu intestino
              </h3>
              <div className="bg-white dark:bg-stone-900 rounded-2xl divide-y divide-stone-100 dark:divide-stone-800 shadow-sm overflow-hidden border-l-4 border-l-red-400">
                {EVITAR_INTESTINO.map(e => (
                  <div key={e.nombre} className="px-4 py-3">
                    <p className="font-semibold text-sm text-stone-900 dark:text-stone-100">{e.nombre}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">{e.razon}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-400 dark:text-stone-500 text-center pb-2">
              Como siempre: estos cambios son complementarios a tu tratamiento médico, no un reemplazo.
            </p>
          </div>
        )}

        {/* TABS: VERDE / AMARILLO / ROJO */}
        {tab !== 'intestino' && (
          <>
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="search"
                placeholder={`Buscar en ${activeTab.label.toLowerCase()}...`}
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-naranja"
              />
            </div>

            <div className="flex items-center justify-between">
              {tieneCondicion && (
                <button
                  onClick={() => setFiltrarPorCondicion(!filtrarPorCondicion)}
                  className={`text-xs min-h-[36px] px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    filtrarPorCondicion
                      ? 'bg-brand-verde text-white border-brand-verde'
                      : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  {filtrarPorCondicion ? '✓ Filtrando mi condición' : 'Filtrar por mi condición'}
                </button>
              )}
              <p className="text-xs text-stone-400 ml-auto">
                {activeTab.desc} · {filtrados.length} alimentos
              </p>
            </div>

            {filtrados.length === 0 && (
              <div className="text-center py-12 text-stone-400 dark:text-stone-500">
                <p className="text-4xl mb-2">🔍</p>
                <p className="font-medium">No encontramos "{busqueda}"</p>
              </div>
            )}

            <div className="space-y-3">
              {filtrados.map(a => {
                const badge = condicionBadge(a);
                return (
                  <div
                    key={a.id}
                    className={`bg-white dark:bg-stone-900 rounded-2xl p-4 ${borderLeft[tab]} shadow-sm`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{a.nombre}</h3>
                      {badge && (
                        <span className="text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full shrink-0 leading-snug">
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">{a.descripcion}</p>
                    <p className={`text-xs mt-1.5 leading-relaxed font-medium ${
                      tab === 'rojo'
                        ? 'text-red-600 dark:text-red-400'
                        : tab === 'amarillo'
                          ? 'text-yellow-700 dark:text-yellow-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {a.razon_tiroides}
                    </p>
                    {a.reemplazo_sugerido && (
                      <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-3 py-2">
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Reemplazalo por →</span>
                        <span className="text-xs text-emerald-700 dark:text-emerald-300">{a.reemplazo_sugerido}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
