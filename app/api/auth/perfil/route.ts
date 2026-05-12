import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getUsuarioActual } from '@/lib/auth';

export async function GET() {
  const usuario = await getUsuarioActual();
  if (!usuario) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('usuarios')
    .select('id, email, nombre, condicion_tiroidea, sigue_tratamiento, restricciones, sintomas, vio_bienvenida')
    .eq('id', usuario.sub)
    .single();

  const { data: favoritos } = await supabase
    .from('recetas_favoritas')
    .select('receta_id')
    .eq('usuario_id', usuario.sub);

  const { data: cocinadas } = await supabase
    .from('recetas_cocinadas')
    .select('receta_id')
    .eq('usuario_id', usuario.sub);

  return NextResponse.json({
    ...data,
    favoritos: favoritos?.map(f => f.receta_id) || [],
    cocinadas: cocinadas?.map(c => c.receta_id) || [],
  });
}

export async function PUT(request: NextRequest) {
  const usuario = await getUsuarioActual();
  if (!usuario) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { condicion_tiroidea, sigue_tratamiento, restricciones, sintomas, vio_bienvenida } = body;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('usuarios')
    .update({ condicion_tiroidea, sigue_tratamiento, restricciones, sintomas, vio_bienvenida })
    .eq('id', usuario.sub);

  if (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
