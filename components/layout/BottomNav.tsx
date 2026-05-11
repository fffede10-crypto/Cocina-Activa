'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  BookOpenIcon,
  StarIcon,
  SparklesIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  StarIcon as StarIconSolid,
  SparklesIcon as SparklesIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';
import { contarPendientes, LISTA_EVENT } from '@/lib/lista-compras';

const nav = [
  { href: '/dashboard',      label: 'Inicio',  Icon: HomeIcon,         IconActive: HomeIconSolid },
  { href: '/recetas',        label: 'Recetas', Icon: BookOpenIcon,      IconActive: BookOpenIconSolid },
  { href: '/receta-del-dia', label: 'Del día', Icon: SparklesIcon,      IconActive: SparklesIconSolid },
  { href: '/guia-alimentos', label: 'Guía',    Icon: StarIcon,          IconActive: StarIconSolid },
  { href: '/lista-compras',  label: 'Lista',   Icon: ShoppingCartIcon,  IconActive: ShoppingCartIconSolid },
  { href: '/perfil',         label: 'Perfil',  Icon: UserIcon,          IconActive: UserIconSolid },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    setPendientes(contarPendientes());
    const handler = () => setPendientes(contarPendientes());
    window.addEventListener(LISTA_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(LISTA_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 md:hidden">
      <div className="flex items-stretch">
        {nav.map(({ href, label, Icon, IconActive }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const Ic = active ? IconActive : Icon;
          const esLista = href === '/lista-compras';
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors ${
                active
                  ? 'text-brand-naranja'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Ic className="w-5 h-5" />
                {esLista && pendientes > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-[#F97316] rounded-full text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {pendientes > 9 ? '9+' : pendientes}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
