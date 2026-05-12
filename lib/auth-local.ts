'use client';

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login';
}

export async function toggleFavorito(recetaId: number): Promise<void> {
  await fetch('/api/recetas/favoritos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receta_id: recetaId }),
  });
}

export async function marcarCocinada(recetaId: number): Promise<{ total: number }> {
  const res = await fetch('/api/recetas/cocinadas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receta_id: recetaId }),
  });
  return res.json();
}
