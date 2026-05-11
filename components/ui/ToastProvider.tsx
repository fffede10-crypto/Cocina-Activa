'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useToast, Toast } from '@/hooks/useToast';
import ToastContainer from './Toast';

interface ToastContextType {
  showToast: (mensaje: string, tipo?: Toast['tipo']) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, showToast, removeToast } = useToast();
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
