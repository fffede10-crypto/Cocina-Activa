'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecetaDelDia, recetas } from '@/lib/recetas';
import { getPerfil, toggleFavorito, marcarCocinada } from '@/lib/auth-local';
import { getMensajePersonalizado, getCategoriaEmoji } from '@/lib/personalizar';
import { Receta, PerfilUsuario } from '@/types';
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { useToastContext } from '@/components/ui/ToastProvider';
import {
  ClockIcon,
  UserGroupIcon,
  HeartIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';

const categoriaGradient: Record<string, string> = {
  desayuno: 'from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-orange-950/40',
  almuerzo: 'from-green-50 to-emerald-100 dark:from-green-950/60 dark:to-emerald-950/40',
  cena:     'from-blue-50 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-950/40',
  postre:   'from-pink-50 to-rose-100 dark:from-pink-950/60 dark:to-rose-950/40',
  jugo:     'from-green-50 to-teal-100 dark:from-green-950/60 dark:to-teal-950/40',
};

function getFechaEspañola() {
  return new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function RecetaDelDiaPage() {
  const [receta, setReceta] = useState<Receta | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [tick, setTick] = useState(0);
  const { showToast } = useToastContext();

  useEffect(() => {
    const p = getPerfil();
    if (!p) { window.location.href = '/login'; return; }
    setPerfil(p);
    setReceta(getRecetaDelDia());
  }, [tick]);

  if (!receta || !perfil) return null;

  const isFavorito = perfil.favoritos.includes(receta.id);
  const isCocinada = perfil.cocinadas.includes(receta.id);
  const mensaje = getMensajePersonalizado(perfil.condicion_tiroidea, perfil.sintomas);
  const cocinadasCount = recetas.filter(r => perfil.cocinadas.includes(r.id)).length;

  function handleFavorito() {
    toggleFavorito(receta!.id);
    setTick(t => t + 1);
    showToast(
      isFavorito ? 'Quitada de tus favoritas' : 'Agregada a tus favoritas',
      isFavorito ? 'info' : 'favorito'
    );
  }

  function handleCocinada() {
    if (isCocinada) return;
    marcarCocinada(receta!.id);
    setTick(t => t + 1);
    showToast(`¡Qué bien! Ya llevás ${cocinadasCount + 1} recetas cocinadas`, 'exito');
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div>
          <p className="text-xs text-stone-400 dark:text-stone-500 capitalize">{getFechaEspañola()}</p>
          <p className="text-sm text-brand-naranja font-semibold uppercase tracking-wide mt-0.5">Receta del día</p>
          <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 leading-snug">
            {receta.nombre}
          </h1>
        </div>

        {/* Hero */}
        <div className={`relative bg-gradient-to-br ${categoriaGradient[receta.categoria]} rounded-2xl aspect-video flex items-center justify-center overflow-hidden`}>
          {receta.imagen_url ? (
            <Image
              src={receta.imagen_url}
              alt={receta.nombre}
              fill
              className="object-cover rounded-2xl"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          ) : (
            <span className="text-8xl">{getCategoriaEmoji(receta.categoria)}</span>
          )}
        </div>

        {/* Descripción */}
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          {receta.descripcion}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="w-4 h-4" />
            {receta.tiempo_preparacion} min
          </div>
          <div className="flex items-center gap-1.5">
            <UserGroupIcon className="w-4 h-4" />
            {receta.porciones} porciones
          </div>
          <span className="text-xs capitalize text-stone-400">{receta.nivel_dificultad}</span>
        </div>

        {/* Tip personalizado */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            {mensaje}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleFavorito}
            className={`flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              isFavorito
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-400'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300'
            }`}
          >
            {isFavorito ? <HeartSolid className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
            {isFavorito ? 'Favorita' : 'Guardar'}
          </button>
          <button
            onClick={handleCocinada}
            disabled={isCocinada}
            className={`flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              isCocinada
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-700 dark:text-green-400 cursor-default'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 hover:bg-green-50 dark:hover:bg-green-950'
            }`}
          >
            {isCocinada ? <CheckSolid className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
            {isCocinada ? '¡Ya la cociné!' : 'Ya la cociné'}
          </button>
        </div>

        <Link href={`/recetas/${receta.id}`}>
          <Button variant="secondary" fullWidth>
            Ver receta completa e ingredientes →
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
