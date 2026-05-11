'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getRecetaById, getRelacionadas } from '@/lib/recetas';
import { getPerfil, toggleFavorito, marcarCocinada } from '@/lib/auth-local';
import { getLista, agregarIngrediente, agregarTodosIngredientes } from '@/lib/lista-compras';
import { getMensajePersonalizado, getCategoriaEmoji } from '@/lib/personalizar';
import { Receta, PerfilUsuario } from '@/types';
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import Badge from '@/components/ui/Badge';
import RecetaCard from '@/components/recetas/RecetaCard';
import { useToastContext } from '@/components/ui/ToastProvider';
import {
  ArrowLeftIcon,
  HeartIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ShareIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';

const dificultadLabel = { facil: 'Fácil', medio: 'Medio', avanzado: 'Avanzado' };
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

export default function RecetaDetallePage() {
  const params = useParams();
  const id = Number(params.id);
  const { showToast } = useToastContext();

  const [receta, setReceta] = useState<Receta | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [tick, setTick] = useState(0);
  const [modoCocina, setModoCocina] = useState(false);
  const [pasosCompletados, setPasosCompletados] = useState<Set<number>>(new Set());
  const [ingredientesChecked, setIngredientesChecked] = useState<Set<number>>(new Set());
  const [enLista, setEnLista] = useState<Set<string>>(new Set());

  useEffect(() => {
    const r = getRecetaById(id);
    if (!r) { window.location.href = '/recetas'; return; }
    setReceta(r);
    const p = getPerfil();
    if (!p) { window.location.href = '/login'; return; }
    setPerfil(p);
    setPasosCompletados(new Set());
    setIngredientesChecked(new Set());
    const lista = getLista();
    setEnLista(new Set(
      lista
        .filter(item => item.recetaId === r.id && !item.tildado)
        .map(item => item.nombre.toLowerCase())
    ));
  }, [id, tick]);

  if (!receta || !perfil) return null;

  const isFavorito = perfil.favoritos.includes(receta.id);
  const isCocinada = perfil.cocinadas.includes(receta.id);
  const relacionadas = getRelacionadas(receta, 3);
  const mensaje = getMensajePersonalizado(perfil.condicion_tiroidea, perfil.sintomas);

  function handleFavorito() {
    toggleFavorito(receta!.id);
    setTick(t => t + 1);
    showToast(
      isFavorito ? 'Quitada de tus favoritas' : 'Agregada a tus favoritas',
      isFavorito ? 'info' : 'favorito'
    );
  }

  function handleCocinada() {
    if (isCocinada || !perfil) return;
    marcarCocinada(receta!.id);
    const nuevasCantidad = perfil.cocinadas.length + 1;
    setTick(t => t + 1);
    showToast(`¡Receta cocinada! Ya llevás ${nuevasCantidad} en tu historial`, 'exito');
  }

  function handleWhatsApp() {
    const texto = `Mirá esta receta saludable para tiroides: *${receta!.nombre}* (${receta!.tiempo_preparacion} min) — Cocina Activa para Tiroides`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  }

  function handleAgregarIngrediente(ing: { nombre: string; cantidad: string; unidad: string }) {
    const resultado = agregarIngrediente(
      ing.nombre, ing.cantidad, ing.unidad, receta!.id, receta!.nombre
    );
    if (resultado === 'agregado') {
      setEnLista(prev => new Set([...prev, ing.nombre.toLowerCase()]));
      showToast(`"${ing.nombre}" agregado a tu lista 🛒`, 'exito');
    } else {
      showToast(`"${ing.nombre}" ya está en tu lista`, 'info');
    }
  }

  function handleAgregarTodos() {
    const { agregados, yaExistian } = agregarTodosIngredientes(
      receta!.ingredientes, receta!.id, receta!.nombre
    );
    const lista = getLista();
    setEnLista(new Set(
      lista
        .filter(item => item.recetaId === receta!.id && !item.tildado)
        .map(item => item.nombre.toLowerCase())
    ));
    if (agregados > 0 && yaExistian === 0) {
      showToast(`${agregados} ingredientes agregados a tu lista 🛒`, 'exito');
    } else if (agregados > 0) {
      showToast(`${agregados} agregados, ${yaExistian} ya estaban en la lista`, 'info');
    } else {
      showToast('Todos los ingredientes ya estaban en tu lista ✓', 'info');
    }
  }

  function togglePaso(num: number) {
    setPasosCompletados(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }

  function toggleIngrediente(idx: number) {
    setIngredientesChecked(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const textSize = modoCocina ? 'text-xl leading-relaxed' : 'text-sm leading-relaxed';

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/recetas"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Volver a recetas
          </Link>
          <button
            onClick={() => setModoCocina(m => !m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              modoCocina
                ? 'bg-brand-verde text-white border-brand-verde'
                : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300'
            }`}
          >
            <BookOpenIcon className="w-3.5 h-3.5" />
            {modoCocina ? 'Modo normal' : 'Modo cocina'}
          </button>
        </div>

        {/* Hero */}
        <div className={`relative bg-gradient-to-br ${categoriaGradient[receta.categoria]} rounded-2xl aspect-video flex items-center justify-center mb-5 overflow-hidden`}>
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
            <span className="text-7xl">{getCategoriaEmoji(receta.categoria)}</span>
          )}
        </div>

        {/* Title + meta */}
        <div className="space-y-3 mb-5">
          <h1 className={`font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug ${modoCocina ? 'text-3xl' : 'text-2xl'}`}>
            {receta.nombre}
          </h1>
          <p className={`text-stone-500 dark:text-stone-400 ${textSize}`}>
            {receta.descripcion}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-stone-600 dark:text-stone-400">
              <ClockIcon className="w-4 h-4" />
              <span>{receta.tiempo_preparacion} min</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-stone-600 dark:text-stone-400">
              <UserGroupIcon className="w-4 h-4" />
              <span>{receta.porciones} porciones</span>
            </div>
            <Badge
              label={dificultadLabel[receta.nivel_dificultad]}
              color={dificultadColor[receta.nivel_dificultad]}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {receta.sin_gluten   && <Badge label="Sin gluten"   color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" size="sm" />}
            {receta.sin_lacteos  && <Badge label="Sin lácteos"  color="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300" size="sm" />}
            {receta.sin_soja     && <Badge label="Sin soja"     color="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" size="sm" />}
            {receta.sin_azucar   && <Badge label="Sin azúcar"   color="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300" size="sm" />}
            {receta.vegetariana  && <Badge label="Vegetariana"  color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" size="sm" />}
            {receta.apta_hashimoto && perfil.condicion_tiroidea === 'hashimoto' && (
              <Badge label="Apta para Hashimoto" color="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" size="sm" />
            )}
            {receta.apta_hipo && perfil.condicion_tiroidea === 'hipotiroidismo' && (
              <Badge label="Apta para Hipotiroidismo" color="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" size="sm" />
            )}
            {receta.apta_hiper && perfil.condicion_tiroidea === 'hipertiroidismo' && (
              <Badge label="Apta para Hipertiroidismo" color="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" size="sm" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={handleFavorito}
            className={`flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              isFavorito
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-400'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300'
            }`}
          >
            {isFavorito ? <HeartSolid className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
            {isFavorito ? 'Favorita' : 'Guardar favorita'}
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

          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium border bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 transition-colors ml-auto"
          >
            <ShareIcon className="w-4 h-4" />
            Compartir
          </button>
        </div>

        {/* Tip personalizado para condición */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <p className={`text-amber-800 dark:text-amber-300 ${textSize}`}>
            <strong>Para tu tiroides:</strong> {mensaje}
          </p>
          {(receta.sin_gluten || receta.sin_lacteos) && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {receta.sin_gluten  && <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">Sin gluten ✓</span>}
              {receta.sin_lacteos && <span className="text-xs bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full font-medium">Sin lácteos ✓</span>}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`font-serif font-bold text-stone-900 dark:text-stone-100 ${modoCocina ? 'text-2xl' : 'text-xl'}`}>
              Ingredientes
            </h2>
            <button
              onClick={handleAgregarTodos}
              className="flex items-center gap-1.5 bg-[#1B4332] hover:bg-emerald-800 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors shadow-sm"
              aria-label="Agregar todos los ingredientes a la lista de compras"
            >
              <span>🛒</span>
              <span>Agregar todo</span>
            </button>
          </div>
          <ul className="bg-white dark:bg-stone-900 rounded-2xl divide-y divide-stone-100 dark:divide-stone-800 shadow-sm">
            {receta.ingredientes.map((ing, i) => {
              const yaEsta = enLista.has(ing.nombre.toLowerCase());
              const esOpcional =
                ing.cantidad === 'opcional' ||
                ing.nombre.toLowerCase().includes('opcional');
              return (
                <li
                  key={i}
                  onClick={() => toggleIngrediente(i)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 ${
                    ingredientesChecked.has(i) ? 'opacity-50' : ''
                  }`}
                >
                  <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    ingredientesChecked.has(i)
                      ? 'border-green-500 bg-green-500'
                      : 'border-stone-300 dark:border-stone-600'
                  }`}>
                    {ingredientesChecked.has(i) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`flex-1 text-stone-900 dark:text-stone-100 ${textSize} ${ingredientesChecked.has(i) ? 'line-through' : ''}`}>
                    <span className={`${modoCocina ? 'text-base' : 'text-xs'} text-stone-400 dark:text-stone-500 mr-1`}>
                      {ing.cantidad} {ing.unidad}
                    </span>
                    {ing.nombre}
                    {esOpcional && (
                      <span className="text-xs text-stone-400 ml-1">(opcional)</span>
                    )}
                  </span>
                  {!esOpcional && (
                    <button
                      onClick={e => { e.stopPropagation(); handleAgregarIngrediente(ing); }}
                      disabled={yaEsta}
                      aria-label={yaEsta ? `${ing.nombre} ya está en la lista` : `Agregar ${ing.nombre} a la lista de compras`}
                      title={yaEsta ? 'Ya está en tu lista' : 'Agregar a la lista de compras'}
                      className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        yaEsta
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 cursor-default'
                          : 'bg-white dark:bg-stone-800 hover:bg-[#1B4332] hover:text-white dark:hover:bg-emerald-800 text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-700 hover:border-transparent shadow-sm'
                      }`}
                    >
                      {yaEsta ? '✓' : '+'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {enLista.size > 0 && (
            <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <p className="text-sm text-emerald-800 dark:text-emerald-300">
                🛒 {enLista.size} ingrediente{enLista.size > 1 ? 's' : ''} de esta receta en tu lista
              </p>
              <a
                href="/lista-compras"
                className="text-sm font-medium text-[#1B4332] dark:text-emerald-400 hover:underline"
              >
                Ver lista →
              </a>
            </div>
          )}
        </section>

        {/* Steps */}
        <section className="mb-6">
          <h2 className={`font-serif font-bold text-stone-900 dark:text-stone-100 mb-3 ${modoCocina ? 'text-2xl' : 'text-xl'}`}>
            Preparación
          </h2>
          <ol className="space-y-3">
            {receta.pasos.map(paso => {
              const completado = pasosCompletados.has(paso.numero);
              return (
                <li
                  key={paso.numero}
                  onClick={() => togglePaso(paso.numero)}
                  className={`flex gap-3 cursor-pointer p-3 rounded-xl transition-all ${
                    completado
                      ? 'bg-green-50 dark:bg-green-950/30'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <span className={`shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                    completado
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-verde text-white'
                  }`}>
                    {completado ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : paso.numero}
                  </span>
                  <p className={`text-stone-700 dark:text-stone-300 pt-0.5 flex-1 ${textSize} ${completado ? 'line-through opacity-60' : ''}`}>
                    {paso.descripcion}
                  </p>
                </li>
              );
            })}
          </ol>
          {pasosCompletados.size > 0 && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-2 text-center">
              {pasosCompletados.size} de {receta.pasos.length} pasos completados
            </p>
          )}
        </section>

        {/* Nutritional tip */}
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8">
          <p className={`text-green-800 dark:text-green-300 ${textSize}`}>
            <strong>Aporte nutricional:</strong> {receta.tip_nutricional}
          </p>
        </div>

        {/* Related */}
        {relacionadas.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-3">
              También te puede gustar
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {relacionadas.map(r => (
                <RecetaCard
                  key={r.id}
                  receta={r}
                  isFavorito={perfil.favoritos.includes(r.id)}
                  onFavoritoChange={() => setTick(t => t + 1)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
