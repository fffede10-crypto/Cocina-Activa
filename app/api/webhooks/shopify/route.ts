import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function generarPassword(): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const hmac = request.headers.get('x-shopify-hmac-sha256');

  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(body, 'utf8')
    .digest('base64');

  if (hash !== hmac) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  }

  const order = JSON.parse(body);

  if (order.financial_status !== 'paid') {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const email = order.email?.toLowerCase().trim();
  const nombre = order.billing_address?.first_name
    || order.customer?.first_name
    || 'Usuaria';
  const shopifyOrderId = order.id?.toString();

  if (!email) {
    return NextResponse.json({ error: 'Sin email en la orden' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: existente } = await supabase
    .from('usuarios')
    .select('id, acceso_activo')
    .eq('email', email)
    .single();

  if (existente) {
    if (!existente.acceso_activo) {
      await supabase
        .from('usuarios')
        .update({ acceso_activo: true, shopify_order_id: shopifyOrderId })
        .eq('id', existente.id);
    }
    return NextResponse.json({ ok: true, existing: true });
  }

  const password = generarPassword();
  const passwordHash = await bcrypt.hash(password, 12);

  const { error } = await supabase.from('usuarios').insert({
    email,
    nombre,
    password_hash: passwordHash,
    acceso_activo: true,
    shopify_order_id: shopifyOrderId,
  });

  if (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Tiroides Activa <hola@tiroidesactiva.com.ar>',
      to: email,
      subject: '¡Tu acceso a Tiroides Activa está listo! 🌿',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1C1917;">
          <div style="background: #1B4332; padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #FAFAF7; margin: 0; font-size: 24px;">Tiroides Activa</h1>
            <p style="color: #86efac; margin: 8px 0 0; font-size: 14px;">Tu alimentación organizada para la tiroides</p>
          </div>
          <div style="padding: 32px 24px; background: #ffffff;">
            <p style="font-size: 18px; margin: 0 0 16px;">¡Hola ${nombre}! 👋</p>
            <p style="color: #57534E; margin: 0 0 24px;">Tu acceso vitalicio a Tiroides Activa está listo. Estos son tus datos para ingresar:</p>
            <div style="background: #D1FAE5; border-left: 4px solid #1B4332; padding: 16px 20px; margin: 0 0 24px; border-radius: 8px;">
              <p style="margin: 0 0 8px; font-size: 15px;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0; font-size: 15px;"><strong>Contraseña:</strong> ${password}</p>
            </div>
            <p style="color: #57534E; font-size: 14px; margin: 0 0 24px;">
              Te recomendamos cambiar tu contraseña después del primer ingreso desde tu perfil.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login"
                 style="background: #F97316; color: white; padding: 14px 32px; border-radius: 8px;
                        text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                Ingresar ahora →
              </a>
            </div>
          </div>
          <div style="background: #F5F5F0; padding: 16px 24px; text-align: center; font-size: 12px; color: #57534E; border-radius: 0 0 12px 12px;">
            ¿Problemas para ingresar? Respondé este email y te ayudamos.
          </div>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true, created: true });
}
