'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Receta } from '@/types';
import { getCategoriaEmoji } from '@/lib/personalizar';
import { toggleFavorito } from '@/lib/auth-local';
import { HeartIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

interface RecetaCardProps {
  receta: Receta;
  isFavorito?: boolean;
  onFavoritoChange?: () => void;
}

const dificultadColor = {
  facil:    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medio:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  avanzado: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const categoriaGradient: Record<string, string> = {
  desayuno: 'from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-orange-950/40',
  almuerzo: 'from-green-50 to-emerald-100 dark:from-green-950/60 dark:to-emerald-950/40',
  cena:     'from-blue-50 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-950/40',
  postre:   'from-pink-50 to-rose-100 dark:from-pink-950/60 dark:to-rose-950/40',
  jugo:     'from-green-50 to-teal-100 dark:from-green-950/60 dark:to-teal-950/40',
};

const categoriaBorderTop: Record<string, string> = {
  desayuno: 'border-t-4 border-amber-400',
  almuerzo: 'border-t-4 border-emerald-500',
  cena:     'border-t-4 border-blue-500',
  postre:   'border-t-4 border-pink-500',
  jugo:     'border-t-4 border-teal-500',
};

export default function RecetaCard({ receta, isFavorito = false, onFavoritoChange }: RecetaCardProps) {
  async function handleFavorito(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorito(receta.id);
    onFavoritoChange?.();
  }

  return (
    <Link href={`/recetas/${receta.id}`}>
      <div className={`bg-white dark:bg-stone-900 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden group ${categoriaBorderTop[receta.categoria]}`}>
        <div className={`relative bg-gradient-to-br ${categoriaGradient[receta.categoria]} aspect-square flex items-center justify-center overflow-hidden`}>
          {receta.imagen_url ? (
            <Image
              src={receta.imagen_url}
              alt={receta.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 340px"
            />
          ) : (
            <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
              {getCategoriaEmoji(receta.categoria)}
            </span>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100 leading-snug flex-1 min-w-0 line-clamp-2">
              {receta.nombre}
            </h3>
            <button
              onClick={handleFavorito}
              className="shrink-0 p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1.5 -mt-1 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label={isFavorito ? 'Quitar de favoritas' : 'Agregar a favoritas'}
            >
              {isFavorito
                ? <HeartSolid className="w-5 h-5 text-rose-500" />
                : <HeartIcon className="w-5 h-5 text-stone-300 dark:text-stone-600" />
              }
            </button>
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>{receta.tiempo_preparacion} min</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dificultadColor[receta.nivel_dificultad]}`}>
              {receta.nivel_dificultad}
            </span>
          </div>

          <div className="flex gap-1 mt-2 flex-wrap">
            {receta.sin_gluten && (
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md font-medium">SG</span>
            )}
            {receta.sin_lacteos && (
              <span className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-md font-medium">SL</span>
            )}
            {receta.sin_soja && (
              <span className="text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-md font-medium">SS</span>
            )}
            {receta.vegetariana && (
              <span className="text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-md font-medium">Veg</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
