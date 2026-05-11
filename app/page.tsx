'use client';
import { useEffect } from 'react';
import { isLogueado, getPerfil } from '@/lib/auth-local';

export default function RootPage() {
  useEffect(() => {
    if (!isLogueado()) {
      window.location.href = '/login';
      return;
    }
    const perfil = getPerfil();
    if (perfil && !perfil.vio_bienvenida) {
      window.location.href = '/onboarding';
      return;
    }
    window.location.href = '/dashboard';
  }, []);

  return null;
}
