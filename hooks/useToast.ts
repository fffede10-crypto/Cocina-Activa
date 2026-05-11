'use client';
import { useState, useCallback } from 'react';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: 'exito' | 'favorito' | 'info' | 'borrado';
}

let nextId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((mensaje: string, tipo: Toast['tipo'] = 'exito') => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
