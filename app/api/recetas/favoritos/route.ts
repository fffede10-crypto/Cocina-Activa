import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getUsuarioActual } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const usuario = await getUsuarioActual();
  if (!usuario) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { receta_id } = await request.json();
  const supabase = getSupabaseAdmin();

  const { data: existe } = await supabase
    .from('recetas_favoritas')
    .select('id')
    .eq('usuario_id', usuario.sub)
    .eq('receta_id', receta_id)
    .single();

  if (existe) {
    await supabase.from('recetas_favoritas').delete().eq('id', existe.id);
    return NextResponse.json({ ok: true, accion: 'eliminado' });
  } else {
    await supabase.from('recetas_favoritas').insert({ usuario_id: usuario.sub, receta_id });
    return NextResponse.json({ ok: true, accion: 'agregado' });
  }
}
