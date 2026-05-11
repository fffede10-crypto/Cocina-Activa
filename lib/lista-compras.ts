export interface ItemLista {
  id: string;
  nombre: string;
  cantidad: string;
  unidad: string;
  recetaId: number;
  recetaNombre: string;
  tildado: boolean;
  agregadoEn: string;
}

const KEY = 'cocina_activa_lista';
const EVENT = 'lista-compras-updated';

function dispatch() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENT));
  }
}

export function getLista(): ItemLista[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function setLista(items: ItemLista[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
  dispatch();
}

export function agregarIngrediente(
  nombre: string,
  cantidad: string,
  unidad: string,
  recetaId: number,
  recetaNombre: string
): 'agregado' | 'ya_existe' {
  const lista = getLista();
  const yaExiste = lista.some(
    item =>
      item.nombre.toLowerCase() === nombre.toLowerCase() &&
      item.recetaId === recetaId &&
      !item.tildado
  );
  if (yaExiste) return 'ya_existe';
  setLista([
    ...lista,
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      nombre,
      cantidad,
      unidad,
      recetaId,
      recetaNombre,
      tildado: false,
      agregadoEn: new Date().toISOString(),
    },
  ]);
  return 'agregado';
}

export function agregarTodosIngredientes(
  ingredientes: { nombre: string; cantidad: string; unidad: string }[],
  recetaId: number,
  recetaNombre: string
): { agregados: number; yaExistian: number } {
  let lista = getLista();
  let agregados = 0;
  let yaExistian = 0;
  let t = Date.now();

  for (const ing of ingredientes) {
    if (
      ing.cantidad === 'opcional' ||
      ing.nombre.toLowerCase().includes('opcional')
    )
      continue;
    const yaExiste = lista.some(
      item =>
        item.nombre.toLowerCase() === ing.nombre.toLowerCase() &&
        item.recetaId === recetaId &&
        !item.tildado
    );
    if (yaExiste) {
      yaExistian++;
    } else {
      lista = [
        ...lista,
        {
          id: `${t++}-${Math.random().toString(36).slice(2)}`,
          nombre: ing.nombre,
          cantidad: ing.cantidad,
          unidad: ing.unidad,
          recetaId,
          recetaNombre,
          tildado: false,
          agregadoEn: new Date().toISOString(),
        },
      ];
      agregados++;
    }
  }

  if (agregados > 0) setLista(lista);
  return { agregados, yaExistian };
}

export function toggleTildado(id: string): void {
  setLista(getLista().map(item =>
    item.id === id ? { ...item, tildado: !item.tildado } : item
  ));
}

export function eliminarItem(id: string): void {
  setLista(getLista().filter(item => item.id !== id));
}

export function limpiarLista(): void {
  setLista([]);
}

export function limpiarTildados(): void {
  setLista(getLista().filter(item => !item.tildado));
}

export function contarPendientes(): number {
  return getLista().filter(item => !item.tildado).length;
}

export const LISTA_EVENT = EVENT;
