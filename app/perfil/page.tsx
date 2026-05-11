'use client';
import { useEffect, useState } from 'react';
import { getPerfil, setPerfil as saveProfile, logout } from '@/lib/auth-local';
import { getBadgeCondicion } from '@/lib/personalizar';
import { recetas } from '@/lib/recetas';
import { PerfilUsuario, CondicionTiroidea } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useToastContext } from '@/components/ui/ToastProvider';
import {
  HeartIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const CONDICIONES: { value: CondicionTiroidea; label: string }[] = [
  { value: 'hipotiroidismo', label: 'Hipotiroidismo' },
  { value: 'hipertiroidismo', label: 'Hipertiroidismo' },
  { value: 'hashimoto', label: 'Hashimoto' },
  { value: 'sin_diagnostico', label: 'Sin diagnóstico' },
];

const RESTRICCIONES = [
  { value: 'sin_gluten', label: 'Sin gluten' },
  { value: 'sin_lacteos', label: 'Sin lácteos' },
  { value: 'sin_soja', label: 'Sin soja' },
  { value: 'sin_azucar', label: 'Sin azúcar' },
  { value: 'vegetariana', label: 'Vegetariana' },
];

const SINTOMAS = [
  { value: 'cansancio', label: 'Cansancio o fatiga' },
  { value: 'dificultad_bajar_peso', label: 'Dificultad para bajar de peso' },
  { value: 'caida_pelo', label: 'Caída del pelo' },
  { value: 'niebla_mental', label: 'Niebla mental' },
  { value: 'ansiedad', label: 'Ansiedad' },
  { value: 'problemas_sueno', label: 'Problemas de sueño' },
  { value: 'hinchazón', label: 'Hinchazón' },
];

export default function PerfilPage() {
  const { showToast } = useToastContext();
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [condicion, setCondicion] = useState<CondicionTiroidea | null>(null);
  const [restricciones, setRestricciones] = useState<string[]>([]);
  const [sintomas, setSintomas] = useState<string[]>([]);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const p = getPerfil();
    if (!p) { window.location.href = '/login'; return; }
    setPerfil(p);
    setCondicion(p.condicion_tiroidea);
    setRestricciones(p.restricciones);
    setSintomas(p.sintomas);
  }, []);

  function toggleItem(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter(x => x !== value) : [...list, value]);
  }

  function guardar() {
    if (!perfil) return;
    const updated = { ...perfil, condicion_tiroidea: condicion, restricciones, sintomas };
    saveProfile(updated);
    setPerfil(updated);
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
    showToast('Perfil actualizado correctamente', 'exito');
  }

  if (!perfil) return null;

  const badge = getBadgeCondicion(perfil.condicion_tiroidea);
  const favoritas = recetas.filter(r => perfil.favoritos.includes(r.id));
  const cocinadas = recetas.filter(r => perfil.cocinadas.includes(r.id));

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">Mi perfil</h1>
          <ThemeToggle />
        </div>

        {/* User card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-verde flex items-center justify-center text-white font-bold text-xl">
              {perfil.nombre.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-stone-900 dark:text-stone-100">{perfil.nombre}</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">{perfil.email}</p>
              <div className="mt-1">
                <Badge label={badge.label} color={badge.color} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <HeartIcon className="w-7 h-7 text-rose-500 shrink-0" />
            <div>
              <p className="text-xl font-bold text-stone-900 dark:text-stone-100">{favoritas.length}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Favoritas</p>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <CheckCircleIcon className="w-7 h-7 text-green-500 shrink-0" />
            <div>
              <p className="text-xl font-bold text-stone-900 dark:text-stone-100">{cocinadas.length}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">Cocinadas</p>
            </div>
          </div>
        </div>

        {/* Edit section */}
        {!editando ? (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100">Configuración</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditando(true)}>
                Editar
              </Button>
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Condición</p>
              <p className="text-sm text-stone-900 dark:text-stone-100">
                {CONDICIONES.find(c => c.value === perfil.condicion_tiroidea)?.label || 'No especificada'}
              </p>
            </div>
            {perfil.restricciones.length > 0 && (
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Restricciones</p>
                <div className="flex flex-wrap gap-1">
                  {perfil.restricciones.map(r => (
                    <Badge key={r} label={RESTRICCIONES.find(x => x.value === r)?.label || r} color="bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300" size="sm" />
                  ))}
                </div>
              </div>
            )}
            {perfil.sintomas.length > 0 && (
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Síntomas</p>
                <div className="flex flex-wrap gap-1">
                  {perfil.sintomas.map(s => (
                    <Badge key={s} label={SINTOMAS.find(x => x.value === s)?.label || s} color="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" size="sm" />
                  ))}
                </div>
              </div>
            )}
            {guardado && (
              <p className="text-xs text-green-600 dark:text-green-400">Cambios guardados.</p>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">Editar perfil</h3>

            <div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Condición tiroidea</p>
              <div className="space-y-1.5">
                {CONDICIONES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setCondicion(c.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                      condicion === c.value
                        ? 'border-brand-verde bg-green-50 dark:bg-green-950 font-medium'
                        : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Restricciones</p>
              <div className="flex flex-wrap gap-2">
                {RESTRICCIONES.map(r => (
                  <button
                    key={r.value}
                    onClick={() => toggleItem(restricciones, setRestricciones, r.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      restricciones.includes(r.value)
                        ? 'bg-brand-naranja text-white border-brand-naranja'
                        : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Síntomas</p>
              <div className="flex flex-wrap gap-2">
                {SINTOMAS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => toggleItem(sintomas, setSintomas, s.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      sintomas.includes(s.value)
                        ? 'bg-brand-naranja text-white border-brand-naranja'
                        : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="primary" onClick={guardar} size="sm">Guardar</Button>
              <Button variant="ghost" onClick={() => setEditando(false)} size="sm">Cancelar</Button>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-red-200 dark:border-red-900"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Salir
        </button>
      </div>
    </AppLayout>
  );
}
