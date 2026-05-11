'use client';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface FiltrosProps {
  busqueda: string;
  onBusqueda: (v: string) => void;
  categoria: string;
  onCategoria: (v: string) => void;
  soloAptas: boolean;
  onSoloAptas: (v: boolean) => void;
  tieneCondicion: boolean;
}

const categorias = [
  { value: 'todas',    label: 'Todas' },
  { value: 'desayuno', label: '🌅 Desayuno' },
  { value: 'almuerzo', label: '🥗 Almuerzo' },
  { value: 'cena',     label: '🌙 Cena' },
  { value: 'postre',   label: '🍮 Postre' },
  { value: 'jugo',     label: '🥤 Jugos' },
];

export default function FiltrosRecetas({
  busqueda, onBusqueda,
  categoria, onCategoria,
  soloAptas, onSoloAptas,
  tieneCondicion,
}: FiltrosProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Buscar receta o ingrediente..."
          value={busqueda}
          onChange={e => onBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-naranja"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categorias.map(c => (
          <button
            key={c.value}
            onClick={() => onCategoria(c.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoria === c.value
                ? 'bg-brand-verde text-white'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-stone-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Condition filter */}
      {tieneCondicion && (
        <button
          onClick={() => onSoloAptas(!soloAptas)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
            soloAptas
              ? 'bg-brand-naranja text-white border-brand-naranja'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
          }`}
        >
          <FunnelIcon className="w-4 h-4" />
          Solo aptas para mi condición
        </button>
      )}
    </div>
  );
}
