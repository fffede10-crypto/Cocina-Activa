import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getUsuarioActual } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const usuario = await getUsuarioActual();
  if (!usuario) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { receta_id } = await request.json();
  const supabase = getSupabaseAdmin();

  const { data: existe } = await supabase
    .from('recetas_cocinadas')
    .select('id')
    .eq('usuario_id', usuario.sub)
    .eq('receta_id', receta_id)
    .single();

  if (!existe) {
    await supabase
      .from('recetas_cocinadas')
      .insert({ usuario_id: usuario.sub, receta_id });
  }

  const { count } = await supabase
    .from('recetas_cocinadas')
    .select('*', { count: 'exact' })
    .eq('usuario_id', usuario.sub);

  return NextResponse.json({ ok: true, total: count || 0 });
}
