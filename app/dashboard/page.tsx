'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPerfil } from '@/lib/auth-local';
import { getRecetaDelDia, recetas } from '@/lib/recetas';
import { getBadgeCondicion, getSaludoDelDia, getMensajePersonalizado, getCategoriaEmoji } from '@/lib/personalizar';
import { PerfilUsuario, Receta } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import Badge from '@/components/ui/Badge';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  BookOpenIcon,
  SparklesIcon,
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const TOTAL_RECETAS = 65;

export default function DashboardPage() {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [recetaDia, setRecetaDia] = useState<Receta | null>(null);

  useEffect(() => {
    const p = getPerfil();
    if (!p) { window.location.href = '/login'; return; }
    setPerfil(p);
    setRecetaDia(getRecetaDelDia());
  }, []);

  if (!perfil || !recetaDia) return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
        <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      </div>
    </AppLayout>
  );

  const badge = getBadgeCondicion(perfil.condicion_tiroidea);
  const saludo = getSaludoDelDia(perfil.nombre);
  const mensaje = getMensajePersonalizado(perfil.condicion_tiroidea, perfil.sintomas);
  const favoritas = recetas.filter(r => perfil.favoritos.includes(r.id));
  const cocinadasCount = perfil.cocinadas.length;
  const progresoPct = Math.round((cocinadasCount / TOTAL_RECETAS) * 100);

  const accesos = [
    { href: '/recetas', label: 'Recetas', sub: '65 recetas disponibles', Icon: BookOpenIcon, color: 'bg-green-50 dark:bg-green-950/60 text-brand-verde dark:text-green-400' },
    { href: '/receta-del-dia', label: 'Receta del día', sub: 'Personalizada para vos', Icon: SparklesIcon, color: 'bg-orange-50 dark:bg-orange-950/60 text-brand-naranja dark:text-orange-400' },
    { href: '/guia-alimentos', label: 'Guía de alimentos', sub: 'Verde, amarillo y rojo', Icon: StarIcon, color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' },
    { href: '/lista-compras', label: 'Lista de compras', sub: 'Tu próxima compra', Icon: ShoppingCartIcon, color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {saludo}
            </h1>
            <div className="mt-1.5">
              <Badge label={badge.label} color={badge.color} size="sm" />
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Banner bienvenida — solo si nunca cocinó ni guardó favoritas */}
        {cocinadasCount === 0 && favoritas.length === 0 && (
          <div className="bg-brand-verde/10 dark:bg-brand-verde/20 border border-brand-verde/30 dark:border-brand-verde/40 rounded-2xl px-4 py-4 space-y-1">
            <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
              ¡Bienvenida, {perfil.nombre}! 🎉
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Ya tenés acceso a las 65 recetas organizadas para tu{' '}
              {perfil.condicion_tiroidea && perfil.condicion_tiroidea !== 'sin_diagnostico'
                ? perfil.condicion_tiroidea
                : 'bienestar'}
              . Empezá por la receta del día 👇
            </p>
          </div>
        )}

        {/* Banner restricciones */}
        {perfil.restricciones.includes('sin_gluten') && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-2.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <span>💚</span>
            <span>Filtrando automáticamente recetas sin gluten para vos</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <HeartIcon className="w-8 h-8 text-rose-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{favoritas.length}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Favoritas</p>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <CheckCircleIcon className="w-8 h-8 text-green-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{cocinadasCount}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Cocinadas</p>
            </div>
          </div>
        </div>

        {/* Progreso */}
        {cocinadasCount > 0 && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Tu progreso
              </p>
              <p className="text-xs text-stone-400">{cocinadasCount} de {TOTAL_RECETAS} recetas</p>
            </div>
            <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-verde rounded-full transition-all duration-500"
                style={{ width: `${progresoPct}%` }}
              />
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1.5">
              {progresoPct < 25 ? '¡Arrancastes genial!' : progresoPct < 50 ? '¡Vas muy bien!' : progresoPct < 75 ? '¡Más de la mitad!' : '¡Casi completa!'}
            </p>
          </div>
        )}

        {/* Receta del día */}
        <div>
          <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">
            Receta del día
          </h2>
          <Link href={`/recetas/${recetaDia.id}`}>
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {getCategoriaEmoji(recetaDia.categoria)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                    {recetaDia.nombre}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                    {recetaDia.descripcion}
                  </p>
                  <p className="text-xs text-brand-naranja font-medium mt-2 leading-relaxed">
                    {mensaje}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-stone-400 dark:text-stone-500 space-y-1 pt-0.5">
                  <p>{recetaDia.tiempo_preparacion} min</p>
                  <p>{recetaDia.porciones} porc.</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Accesos rápidos */}
        <div>
          <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">
            Accesos rápidos
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {accesos.map(({ href, label, sub, Icon, color }) => (
              <Link key={href} href={href}>
                <div className={`rounded-2xl p-4 flex flex-col gap-2 ${color} hover:opacity-90 active:scale-[0.98] transition-all`}>
                  <Icon className="w-6 h-6" />
                  <div>
                    <p className="font-semibold text-sm leading-snug">{label}</p>
                    <p className="text-xs opacity-70 mt-0.5 leading-snug">{sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Ritual de mañana */}
        <div>
          <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100 mb-1">
            ☀️ Tu ritual de mañana
          </h2>
          <p className="text-xs text-stone-400 dark:text-stone-500 mb-3">
            Tres hábitos simples para empezar el día cuidando tu tiroides
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/recetas/64" className="shrink-0">
              <div className="w-44 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 hover:shadow-md transition-shadow">
                <span className="text-2xl block mb-2">💧</span>
                <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-200 leading-snug">
                  Agua con limón y cúrcuma
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1 leading-relaxed">
                  Antiinflamatorio · 3 min
                </p>
              </div>
            </Link>
            <Link href="/recetas/61" className="shrink-0">
              <div className="w-44 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 hover:shadow-md transition-shadow">
                <span className="text-2xl block mb-2">🥬</span>
                <p className="font-semibold text-sm text-emerald-900 dark:text-emerald-200 leading-snug">
                  Jugo verde clásico
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed">
                  Para la tiroides · 5 min
                </p>
              </div>
            </Link>
            <Link href="/guia-alimentos" className="shrink-0">
              <div className="w-44 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl p-4 hover:shadow-md transition-shadow">
                <span className="text-2xl block mb-2">🦠</span>
                <p className="font-semibold text-sm text-teal-900 dark:text-teal-200 leading-snug">
                  Probiótico natural
                </p>
                <p className="text-xs text-teal-700 dark:text-teal-400 mt-1 leading-relaxed">
                  Intestino & tiroides
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Favoritas recientes */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              Tus favoritas
            </h2>
            {favoritas.length > 0 && (
              <Link href="/recetas" className="text-xs text-brand-naranja hover:underline">
                Ver todas
              </Link>
            )}
          </div>
          {favoritas.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm text-center space-y-2">
              <p className="text-3xl">🤍</p>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Todavía no guardaste ninguna receta como favorita
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                Explorá las recetas y tocá el corazón para guardarlas acá
              </p>
              <Link
                href="/recetas"
                className="inline-block mt-2 px-4 py-2 bg-brand-verde text-white text-xs font-semibold rounded-xl hover:bg-green-800 transition-colors"
              >
                Ver recetas
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {favoritas.slice(0, 3).map(r => (
                <Link key={r.id} href={`/recetas/${r.id}`}>
                  <div className="bg-white dark:bg-stone-900 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-xl">{getCategoriaEmoji(r.categoria)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-stone-900 dark:text-stone-100 truncate">{r.nombre}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500">{r.tiempo_preparacion} min · {r.nivel_dificultad}</p>
                    </div>
                    <HeartIcon className="w-4 h-4 text-rose-400 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
