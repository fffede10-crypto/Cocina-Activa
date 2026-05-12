'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { filtrarRecetas } from '@/lib/recetas';
import { PerfilUsuario, Receta } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import RecetaCard from '@/components/recetas/RecetaCard';
import FiltrosRecetas from '@/components/recetas/FiltrosRecetas';

export default function RecetasPage() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaDebounced, setBusquedaDebounced] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [soloAptas, setSoloAptas] = useState(false);
  const [resultados, setResultados] = useState<Receta[]>([]);
  const [tick, setTick] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reloadPerfil = useCallback(async () => {
    const res = await fetch('/api/auth/perfil');
    if (!res.ok) { window.location.href = '/login'; return; }
    const p = await res.json();
    setPerfil(p);
    setTick(t => t + 1);
  }, []);

  useEffect(() => { reloadPerfil(); }, [reloadPerfil]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setBusquedaDebounced(busqueda), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [busqueda]);

  useEffect(() => {
    if (!perfil) return;
    const r = filtrarRecetas({
      categoria,
      condicion: soloAptas ? perfil.condicion_tiroidea : null,
      restricciones: soloAptas ? perfil.restricciones : [],
      busqueda: busquedaDebounced,
    });
    setResultados(r);
  }, [perfil, busquedaDebounced, categoria, soloAptas, tick]);

  if (!perfil) return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="h-8 w-32 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="space-y-3">
          <div className="h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse aspect-square" />
          ))}
        </div>
      </div>
    </AppLayout>
  );

  const tieneCondicion = !!perfil.condicion_tiroidea && perfil.condicion_tiroidea !== 'sin_diagnostico';

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
          Recetas
        </h1>

        <FiltrosRecetas
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          categoria={categoria}
          onCategoria={setCategoria}
          soloAptas={soloAptas}
          onSoloAptas={setSoloAptas}
          tieneCondicion={tieneCondicion}
        />

        <p className="text-xs text-stone-400 dark:text-stone-500">
          {resultados.length} receta{resultados.length !== 1 ? 's' : ''} encontradas
        </p>

        {resultados.length === 0 ? (
          <div className="text-center py-16 text-stone-400 dark:text-stone-500">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-medium text-stone-500 dark:text-stone-400">
              No encontramos recetas con esos filtros
            </p>
            <p className="text-sm mt-1">Probá cambiando la búsqueda o los filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {resultados.map(r => (
              <RecetaCard
                key={r.id}
                receta={r}
                isFavorito={perfil.favoritos.includes(r.id)}
                onFavoritoChange={reloadPerfil}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
