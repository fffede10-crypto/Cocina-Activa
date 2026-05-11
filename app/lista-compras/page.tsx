'use client';
import { useState, useEffect } from 'react';
import { getPerfil } from '@/lib/auth-local';
import AppLayout from '@/components/layout/AppLayout';
import { useToastContext } from '@/components/ui/ToastProvider';
import { TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import {
  getLista,
  toggleTildado,
  eliminarItem,
  limpiarLista,
  limpiarTildados,
  ItemLista,
  LISTA_EVENT,
} from '@/lib/lista-compras';

export default function ListaComprasPage() {
  const [items, setItems] = useState<ItemLista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [confirmando, setConfirmando] = useState<'tildados' | 'todo' | null>(null);
  const { showToast } = useToastContext();

  useEffect(() => {
    const p = getPerfil();
    if (!p) { window.location.href = '/login'; return; }
    setItems(getLista());
    setCargando(false);

    const handler = () => setItems(getLista());
    window.addEventListener(LISTA_EVENT, handler);
    return () => window.removeEventListener(LISTA_EVENT, handler);
  }, []);

  function handleToggle(id: string) {
    toggleTildado(id);
    setItems(getLista());
  }

  function handleEliminar(id: string) {
    eliminarItem(id);
    setItems(getLista());
  }

  function handleLimpiarTildados() {
    if (confirmando === 'tildados') {
      limpiarTildados();
      setItems(getLista());
      setConfirmando(null);
      showToast('Items tildados eliminados', 'borrado');
    } else {
      setConfirmando('tildados');
      setTimeout(() => setConfirmando(null), 3000);
    }
  }

  function handleLimpiarTodo() {
    if (confirmando === 'todo') {
      limpiarLista();
      setItems([]);
      setConfirmando(null);
      showToast('Lista limpiada', 'borrado');
    } else {
      setConfirmando('todo');
      setTimeout(() => setConfirmando(null), 3000);
    }
  }

  function handleWhatsApp() {
    const pendientes = items.filter(i => !i.tildado);
    if (pendientes.length === 0) {
      showToast('No hay items pendientes para compartir', 'info');
      return;
    }
    const porReceta = pendientes.reduce<Record<string, ItemLista[]>>((acc, item) => {
      const key = item.recetaNombre || 'Items sueltos';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    let texto = '🛒 *Mi Lista de Compras — Cocina Activa*\n\n';
    for (const [receta, its] of Object.entries(porReceta)) {
      texto += `🍽️ *${receta}*\n`;
      its.forEach(i => {
        texto += `• ${i.cantidad} ${i.unidad} ${i.nombre}\n`;
      });
      texto += '\n';
    }
    texto += '_Generado con Cocina Activa para Tiroides 💚_';
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  }

  const itemsAgrupados = items.reduce<Record<string, { recetaId: number; items: ItemLista[] }>>(
    (acc, item) => {
      const key = item.recetaNombre || 'Items sueltos';
      if (!acc[key]) acc[key] = { recetaId: item.recetaId, items: [] };
      acc[key].items.push(item);
      return acc;
    },
    {}
  );

  const pendientes = items.filter(i => !i.tildado).length;
  const tildados = items.filter(i => i.tildado).length;
  const porcentaje = items.length > 0 ? Math.round((tildados / items.length) * 100) : 0;

  if (cargando) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-stone-200 dark:bg-stone-700 rounded-2xl" />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Lista de compras 🛒
          </h1>
          {items.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400 mb-1.5">
                <span>{pendientes} pendiente{pendientes !== 1 ? 's' : ''}</span>
                <span>{tildados} de {items.length} listos</span>
              </div>
              <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1B4332] dark:bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Estado vacío */}
        {items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🛒</p>
            <h2 className="font-serif text-xl font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Tu lista está vacía
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-xs mx-auto mb-6">
              Entrá a cualquier receta, tocá el &ldquo;+&rdquo; al lado de cada ingrediente
              y lo agregás acá con un clic.
            </p>
            <a
              href="/recetas"
              className="inline-block bg-[#1B4332] text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-800 transition-colors"
            >
              Ver recetas →
            </a>
          </div>
        )}

        {/* Lista agrupada por receta */}
        {Object.entries(itemsAgrupados).map(([recetaNombre, grupo]) => (
          <div key={recetaNombre}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🍽️</span>
              <h3 className="font-semibold text-stone-800 dark:text-stone-200 text-sm flex-1">
                {recetaNombre}
              </h3>
              {grupo.recetaId > 0 && (
                <a
                  href={`/recetas/${grupo.recetaId}`}
                  className="text-xs text-[#1B4332] dark:text-emerald-400 hover:underline"
                >
                  Ver receta →
                </a>
              )}
            </div>
            <ul className="bg-white dark:bg-stone-900 rounded-2xl divide-y divide-stone-100 dark:divide-stone-800 shadow-sm overflow-hidden">
              {grupo.items.map(item => (
                <li
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-all ${
                    item.tildado ? 'opacity-55' : ''
                  }`}
                >
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.tildado
                        ? 'bg-green-500 border-green-500'
                        : 'border-stone-300 dark:border-stone-600 hover:border-[#1B4332]'
                    }`}
                    aria-label={item.tildado ? `Desmarcar ${item.nombre}` : `Marcar ${item.nombre} como comprado`}
                  >
                    {item.tildado && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <span className={`flex-1 text-sm ${
                    item.tildado
                      ? 'line-through text-stone-400 dark:text-stone-500'
                      : 'text-stone-900 dark:text-stone-100'
                  }`}>
                    <span className="text-stone-400 dark:text-stone-500 text-xs mr-1">
                      {item.cantidad} {item.unidad}
                    </span>
                    {item.nombre}
                  </span>
                  <button
                    onClick={() => handleEliminar(item.id)}
                    className="text-stone-300 dark:text-stone-600 hover:text-red-400 transition-colors p-1"
                    aria-label={`Eliminar ${item.nombre}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Acciones */}
        {items.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-700">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              <span>📲</span>
              <span>Compartir por WhatsApp</span>
            </button>

            {tildados > 0 && (
              <button
                onClick={handleLimpiarTildados}
                className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl transition-colors border ${
                  confirmando === 'tildados'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-orange-300'
                }`}
              >
                <span>🗑️</span>
                <span>
                  {confirmando === 'tildados'
                    ? '¿Confirmás? Tocá de nuevo'
                    : `Limpiar tildados (${tildados})`}
                </span>
              </button>
            )}

            <button
              onClick={handleLimpiarTodo}
              className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl transition-colors border ${
                confirmando === 'todo'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-500 border-stone-200 dark:border-stone-700 hover:border-red-300 hover:text-red-500'
              }`}
            >
              <span>🗑️</span>
              <span>
                {confirmando === 'todo' ? '¿Confirmás? Tocá de nuevo' : 'Limpiar toda la lista'}
              </span>
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
