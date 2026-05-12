'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  BookOpenIcon,
  SparklesIcon,
  StarIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { contarPendientes, LISTA_EVENT } from '@/lib/lista-compras';

const nav = [
  { href: '/dashboard',      label: 'Inicio',             Icon: HomeIcon },
  { href: '/recetas',        label: 'Recetas',             Icon: BookOpenIcon },
  { href: '/receta-del-dia', label: 'Receta del día',      Icon: SparklesIcon },
  { href: '/guia-alimentos', label: 'Guía de alimentos',   Icon: StarIcon },
  { href: '/lista-compras',  label: 'Lista de compras',    Icon: ShoppingCartIcon },
  { href: '/perfil',         label: 'Mi perfil',           Icon: UserIcon },
];

export default function Sidebar() {
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
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-700">
      <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700">
        <span className="font-serif text-xl font-bold text-brand-verde dark:text-green-400 leading-tight">
          Tiroides Activa
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const esLista = href === '/lista-compras';
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-verde text-white'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <div className="relative shrink-0">
                <Icon className="w-5 h-5" />
                {esLista && pendientes > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-[#F97316] rounded-full text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {pendientes > 9 ? '9+' : pendientes}
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-stone-200 dark:border-stone-700 flex justify-end">
        <ThemeToggle />
      </div>
    </aside>
  );
}
