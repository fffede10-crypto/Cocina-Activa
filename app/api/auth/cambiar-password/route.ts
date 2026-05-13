import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getUsuarioActual } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const usuario = await getUsuarioActual();
  if (!usuario) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { passwordActual, passwordNueva } = await request.json();

  if (!passwordActual || !passwordNueva) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  if (passwordNueva.length < 8) {
    return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('usuarios')
    .select('password_hash')
    .eq('id', usuario.sub)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Error al verificar usuario' }, { status: 500 });
  }

  const ok = await bcrypt.compare(passwordActual, data.password_hash);
  if (!ok) {
    return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 401 });
  }

  const nuevoHash = await bcrypt.hash(passwordNueva, 12);

  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ password_hash: nuevoHash })
    .eq('id', usuario.sub);

  if (updateError) {
    return NextResponse.json({ error: 'Error al actualizar la contraseña' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
