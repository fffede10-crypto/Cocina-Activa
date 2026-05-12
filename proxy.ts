import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const RUTAS_PROTEGIDAS = [
  '/dashboard',
  '/recetas',
  '/receta-del-dia',
  '/guia-alimentos',
  '/lista-compras',
  '/perfil',
  '/onboarding',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const esProtegida = RUTAS_PROTEGIDAS.some(r => pathname.startsWith(r));
  if (!esProtegida) return NextResponse.next();

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/recetas/:path*',
    '/receta-del-dia/:path*',
    '/guia-alimentos/:path*',
    '/lista-compras/:path*',
    '/perfil/:path*',
    '/onboarding/:path*',
  ],
};
