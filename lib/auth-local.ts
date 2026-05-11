'use client';
import { PerfilUsuario } from '@/types';

const KEY = 'cocina_activa_perfil';

export const PERFIL_DEMO: PerfilUsuario = {
  nombre: 'María',
  email: 'maria@ejemplo.com',
  condicion_tiroidea: 'hashimoto',
  sigue_tratamiento: 'con_medicacion',
  restricciones: ['sin_gluten', 'sin_lacteos'],
  sintomas: ['cansancio', 'caida_pelo', 'niebla_mental'],
  vio_bienvenida: false,
  favoritos: [],
  cocinadas: [],
};

export function getPerfil(): PerfilUsuario | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setPerfil(perfil: PerfilUsuario): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(perfil));
}

export function isLogueado(): boolean {
  return getPerfil() !== null;
}

export function loginDemo(): void {
  setPerfil(PERFIL_DEMO);
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
  window.location.href = '/login';
}

export function toggleFavorito(recetaId: number): void {
  const perfil = getPerfil();
  if (!perfil) return;
  const idx = perfil.favoritos.indexOf(recetaId);
  if (idx === -1) perfil.favoritos.push(recetaId);
  else perfil.favoritos.splice(idx, 1);
  setPerfil(perfil);
}

export function marcarCocinada(recetaId: number): void {
  const perfil = getPerfil();
  if (!perfil) return;
  if (!perfil.cocinadas.includes(recetaId)) {
    perfil.cocinadas.push(recetaId);
    setPerfil(perfil);
  }
}
