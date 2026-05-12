'use client';
import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/auth/perfil');
        if (!res.ok) {
          window.location.href = '/login';
          return;
        }
        const perfil = await res.json();
        if (!perfil.vio_bienvenida) {
          window.location.href = '/onboarding';
          return;
        }
        window.location.href = '/dashboard';
      } catch {
        window.location.href = '/login';
      }
    }
    check();
  }, []);

  return null;
}
