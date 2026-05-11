import recetasData from '@/data/recetas.json';
import alimentosData from '@/data/alimentos.json';
import { Receta, Alimento, CondicionTiroidea } from '@/types';

export const recetas: Receta[] = recetasData as Receta[];
export const alimentos: Alimento[] = alimentosData as Alimento[];

export function getRecetaById(id: number): Receta | undefined {
  return recetas.find(r => r.id === id);
}

export function getRecetaDelDia(): Receta {
  const hoy = new Date();
  const diaDelAnio = Math.floor(
    (hoy.getTime() - new Date(hoy.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return recetas[diaDelAnio % recetas.length];
}

export function filtrarRecetas(params: {
  categoria?: string;
  condicion?: CondicionTiroidea | null;
  restricciones?: string[];
  busqueda?: string;
}): Receta[] {
  return recetas.filter(r => {
    if (params.categoria && params.categoria !== 'todas' && r.categoria !== params.categoria) return false;
    if (params.condicion === 'hipotiroidismo' && !r.apta_hipo) return false;
    if (params.condicion === 'hipertiroidismo' && !r.apta_hiper) return false;
    if (params.condicion === 'hashimoto' && !r.apta_hashimoto) return false;
    if (params.restricciones?.includes('sin_gluten') && !r.sin_gluten) return false;
    if (params.restricciones?.includes('sin_lacteos') && !r.sin_lacteos) return false;
    if (params.restricciones?.includes('sin_soja') && !r.sin_soja) return false;
    if (params.restricciones?.includes('sin_azucar') && !r.sin_azucar) return false;
    if (params.restricciones?.includes('vegetariana') && !r.vegetariana) return false;
    if (params.busqueda) {
      const q = params.busqueda.toLowerCase();
      const enNombre = r.nombre.toLowerCase().includes(q);
      const enIngredientes = r.ingredientes.some(i => i.nombre.toLowerCase().includes(q));
      if (!enNombre && !enIngredientes) return false;
    }
    return true;
  });
}

export function getRelacionadas(receta: Receta, cantidad = 3): Receta[] {
  return recetas
    .filter(r => r.id !== receta.id && r.categoria === receta.categoria)
    .slice(0, cantidad);
}

export function getAlimentosPorCategoria(
  categoria: 'verde' | 'amarillo' | 'rojo',
  condicion?: CondicionTiroidea | null
): Alimento[] {
  return alimentos.filter(a => {
    if (a.categoria !== categoria) return false;
    if (condicion === 'hipotiroidismo' && !a.apta_hipo) return false;
    if (condicion === 'hipertiroidismo' && !a.apta_hiper) return false;
    if (condicion === 'hashimoto' && !a.apta_hashimoto) return false;
    return true;
  });
}
