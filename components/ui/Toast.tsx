'use client';
import { Toast } from '@/hooks/useToast';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

const tipoConfig = {
  exito: { bg: 'bg-emerald-600', icon: '✅' },
  favorito: { bg: 'bg-rose-500', icon: '❤️' },
  info: { bg: 'bg-brand-verde', icon: '💡' },
  borrado: { bg: 'bg-stone-600', icon: '🗑️' },
};

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map(t => {
        const { bg, icon } = tipoConfig[t.tipo];
        return (
          <div
            key={t.id}
            className={`${bg} text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 max-w-sm w-full pointer-events-auto animate-fade-in`}
          >
            <span role="img" aria-hidden>{icon}</span>
            <span className="flex-1">{t.mensaje}</span>
            <button
              onClick={() => onRemove(t.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Cerrar"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
