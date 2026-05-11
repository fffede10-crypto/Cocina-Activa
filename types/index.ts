export type CondicionTiroidea =
  | 'hipotiroidismo'
  | 'hipertiroidismo'
  | 'hashimoto'
  | 'sin_diagnostico';

export type CategoriaReceta = 'desayuno' | 'almuerzo' | 'cena' | 'postre' | 'jugo';
export type NivelDificultad = 'facil' | 'medio' | 'avanzado';
export type CategoriaAlimento = 'verde' | 'amarillo' | 'rojo';

export interface Ingrediente {
  cantidad: string;
  unidad: string;
  nombre: string;
}

export interface Paso {
  numero: number;
  descripcion: string;
}

export interface Receta {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: CategoriaReceta;
  tiempo_preparacion: number;
  porciones: number;
  nivel_dificultad: NivelDificultad;
  ingredientes: Ingrediente[];
  pasos: Paso[];
  tip_nutricional: string;
  apta_hipo: boolean;
  apta_hiper: boolean;
  apta_hashimoto: boolean;
  sin_gluten: boolean;
  sin_lacteos: boolean;
  sin_soja: boolean;
  sin_azucar: boolean;
  vegetariana: boolean;
  imagen_url?: string;
}

export interface Alimento {
  id: number;
  nombre: string;
  categoria: CategoriaAlimento;
  descripcion: string;
  razon_tiroides: string;
  apta_hipo: boolean;
  apta_hiper: boolean;
  apta_hashimoto: boolean;
  reemplazo_sugerido: string | null;
}

export interface PerfilUsuario {
  nombre: string;
  email: string;
  condicion_tiroidea: CondicionTiroidea | null;
  sigue_tratamiento: string | null;
  restricciones: string[];
  sintomas: string[];
  vio_bienvenida: boolean;
  favoritos: number[];
  cocinadas: number[];
}
